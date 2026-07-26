import { apiRequest } from "../api.js";
import { API_URL, WARZONE } from "../config.js";

// Filtros válidos confirmados por la API (cualquier otro valor da 400 VALIDATION_ERROR)
export const FILTROS = {
    TAREAS_SECRETAS: "secret_tasks",
    BASES_JUGADORES: "player_bases"
};

const POLL_INTERVALO_MS = 2000;
const POLL_MAX_INTENTOS = 15;

// --- Crear + esperar + descargar un job de Map Scan ---

async function crearJob(filter, warzone = WARZONE) {
    const respuesta = await fetch(`${API_URL}/map-scan/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ warzone, filter })
    });

    const textoCrudo = await respuesta.text();

    if (!respuesta.ok) {
        throw new Error(`Error creando job (${respuesta.status}): ${textoCrudo}`);
    }

    return JSON.parse(textoCrudo);
}

async function descargarJob(jobId) {
    const respuesta = await fetch(`${API_URL}/map-scan/jobs/${jobId}/download`);
    const textoCrudo = await respuesta.text();

    if (!respuesta.ok) {
        throw new Error(`Error descargando job (${respuesta.status}): ${textoCrudo}`);
    }

    return textoCrudo
        .split("\n")
        .filter(l => l.trim() !== "")
        .map(l => {
            try {
                return JSON.parse(l);
            } catch {
                return null;
            }
        })
        .filter(fila => fila !== null);
}

// Espera a que el job esté listo, reintentando la descarga si aún no lo está.
async function esperarYDescargar(jobId) {
    for (let intento = 1; intento <= POLL_MAX_INTENTOS; intento++) {
        try {
            return await descargarJob(jobId);
        } catch (error) {
            if (intento === POLL_MAX_INTENTOS) throw error;
            await new Promise(r => setTimeout(r, POLL_INTERVALO_MS));
        }
    }
}

/**
 * Escanea la warzone con el filtro indicado y devuelve las filas ya
 * filtradas por el backend (solo vigentes, según act_end_time).
 * @param {string} filter - FILTROS.TAREAS_SECRETAS o FILTROS.BASES_JUGADORES
 */
export async function escanearWarzone(filter, warzone = WARZONE) {
    const job = await crearJob(filter, warzone);

    if (job.status === "READY") {
        return await descargarJob(job.jobId);
    }

    // Si no está lista de inmediato (PENDING), esperamos con reintentos
    return await esperarYDescargar(job.jobId);
}

export async function escanearTareasSecretas(warzone = WARZONE) {
    return escanearWarzone(FILTROS.TAREAS_SECRETAS, warzone);
}

export async function escanearBasesJugadores(warzone = WARZONE) {
    return escanearWarzone(FILTROS.BASES_JUGADORES, warzone);
}

// --- Utilidades de análisis (útiles mientras terminamos de mapear cfg_id -> rareza) ---

export function agruparPorTipo(filas) {
    const conteo = {};
    filas.forEach(f => {
        conteo[f.cfg_id] = (conteo[f.cfg_id] || 0) + 1;
    });
    return conteo;
}

export function buscarPorCoordenada(filas, x, y) {
    return filas.find(f => f.x === x && f.y === y) || null;
}

// --- Descripción de cada tarea (familia + nivel), mientras confirmamos rareza ---

// Cuando confirmes en el juego qué cfg_id corresponde a qué rareza real
// (R/SR/SSR/UR), añádelo aquí y se usará en vez de la descripción genérica.
export const CFG_MAP = {
    // Ejemplo una vez confirmado: 60000101: { nombre: "Julka Spulka", color: "morado" },
};

export function describirTarea(cfgId) {
    if (CFG_MAP[cfgId]) return CFG_MAP[cfgId];

    const str = String(cfgId);
    const familia = str.slice(0, -2);
    const nivel = str.slice(-2);

    return {
        nombre: `Familia ${familia} · Nivel ${nivel}`,
        color: null
    };
}

// --- Vigencia de la warzone ---

export async function verVigenciaWarzone(warzone = WARZONE) {
    const datos = await apiRequest("warzones");
    const lista = Array.isArray(datos) ? datos : datos.warzones || [];
    return lista.find(w => w.id == warzone || w.warzoneId == warzone) || null;
}
