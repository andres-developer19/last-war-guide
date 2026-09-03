// Configuración global del frontend.
// La API la sirve un backend separado (proxy a lastwar.tools) desplegado en Render.
// - En local se usa el server.js local (/api/lwt) para no depender de internet.
// - En producción (Vercel/Render, sitio estático) se apunta al backend de Render,
//   que ya tiene CORS habilitado.

const hostname = typeof window !== "undefined" ? window.location.hostname : "";
const esLocal = hostname === "localhost" || hostname === "127.0.0.1";

export const API_URL = esLocal
    ? `${window.location.origin}/api/lwt`
    : "https://last-war-guide-api.onrender.com/api/lwt";

// Alianza por defecto
export const ALLIANCE_ID = "604a3b8fb0604b2d828e5f9052df15e4";

// Server (warzone) por defecto
export const SERVER_ID = 1600;
