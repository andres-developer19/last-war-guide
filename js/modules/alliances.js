import { apiRequest } from "../api.js";

/**
 * Busca alianzas por etiqueta/abreviatura (no por el nombre completo,
 * según la documentación de la API).
 */
export async function buscarAlianzas(etiqueta) {
    if (!etiqueta || !etiqueta.trim()) return [];

    const datos = await apiRequest(`alliances/search?allianceName=${encodeURIComponent(etiqueta.trim())}`);
    return Array.isArray(datos) ? datos : (datos.alliances || []);
}
