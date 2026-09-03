import { API_URL } from "./config.js";

const TIMEOUT_MS = 45000;

function traducirError(status, texto) {
    const t = String(texto || "");

    // Errores conocidos de lastwar.tools
    if (t.includes("Insufficient tokens")) {
        return "Se agotaron los tokens de la API de lastwar.tools (se renuevan cada día). Espera al reinicio diario o consigue más.";
    }
    if (t.includes("session_key") && t.includes("missing")) {
        return "Esta función requiere una sesión activa (LWT_SESSION_KEY). Configúrala en el .env con el Capture Tool.";
    }
    if (t.includes("Invalid handshake")) {
        return "La autenticación falló por protocolo no soportado por la API (e408). Espera la actualización de lastwar.tools.";
    }
    if (status === 429) {
        return "Demasiadas peticiones. Espera un momento y vuelve a intentarlo.";
    }
    if (status === 401 || status === 403) {
        return "API key inválida o sin permisos. Revisa tu LWT_API_KEY.";
    }
    if (status === 404) {
        return "Recurso no encontrado en la API.";
    }
    if (status === 502 || status === 504) {
        return "La API de lastwar.tools no respondió a tiempo. Inténtalo de nuevo.";
    }

    // Intenta extraer el mensaje del JSON de error
    try {
        const parsed = JSON.parse(t);
        if (parsed.detail) {
            if (typeof parsed.detail === "string") return parsed.detail;
            if (Array.isArray(parsed.detail)) {
                return parsed.detail.map(d => d.msg || d.loc?.join(".") || "").filter(Boolean).join(" · ");
            }
        }
        if (parsed.error) return parsed.error;
    } catch { /* no es JSON */ }

    return texto || `Error ${status}`;
}

export async function apiRequest(ruta = "", options = {}) {
    const url = ruta ? `${API_URL}/${ruta}` : API_URL;

    const controlador = new AbortController();
    const timer = setTimeout(() => controlador.abort(), TIMEOUT_MS);

    let respuesta;
    try {
        respuesta = await fetch(url, {
            method: options.method || "GET",
            headers: options.body ? { "Content-Type": "application/json" } : undefined,
            body: options.body ? JSON.stringify(options.body) : undefined,
            signal: controlador.signal
        });
    } catch (e) {
        clearTimeout(timer);
        if (e.name === "AbortError") {
            throw new Error("La petición tardó demasiado. La API de lastwar.tools puede estar lenta; vuelve a intentarlo.");
        }
        throw new Error("No se pudo conectar con el servidor. Revisa que el backend esté activo.");
    }

    clearTimeout(timer);

    const textoCrudo = await respuesta.text();

    if (!respuesta.ok) {
        throw new Error(traducirError(respuesta.status, textoCrudo));
    }

    try {
        return JSON.parse(textoCrudo);
    } catch {
        return textoCrudo;
    }
}
