// Configuración global del frontend.
// API_URL apunta al proxy del MISMO servidor que sirve esta web
// (server.js reenvía /api/lwt/* a la API de lastwar.tools).
// En local: http://localhost:3000

export const API_URL = `${window.location.origin}/api/lwt`;

// Alianza por defecto
export const ALLIANCE_ID = "604a3b8fb0604b2d828e5f9052df15e4";

// Server (warzone) por defecto
export const SERVER_ID = 1600;
