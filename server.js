// server.js — Frontend + proxy de lastwar.tools
// Sirve los archivos estáticos del frontend y reenvía /api/lwt/* a la
// API de lastwar.tools (para evitar CORS y ocultar la API key).

require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const LWT_BASE = "https://api.lastwar.tools";
const LWT_API_KEY = process.env.LWT_API_KEY;

if (!LWT_API_KEY) {
    console.error("");
    console.error("❌ ERROR: Falta la variable LWT_API_KEY en .env");
    console.error("Copia .env.example a .env y pon tu API key de https://api.lastwar.tools");
    process.exit(1);
}

app.use(express.json());

// ------------------------------------------------------------
// Proxy a lastwar.tools
// ------------------------------------------------------------

const RUTAS_MAP = {
    "mundo/bloque":                { api: "/world/block", method: "get", publico: true },
    "mundo/escanear":              { api: "/world/scan", method: "get", publico: true },
    "mundo/buscar-jugador":        { api: "/world/find-player", method: "get", publico: true },
    "reino/posiciones/:server_id": { api: "/kingdom/{server_id}/positions", method: "get", publico: true },
    "rankings/alianzas/:server_id":{ api: "/rankings/{server_id}/alliances", method: "get", publico: true },
    "alianza/miembros/:alliance_id": { api: "/alliance/{alliance_id}/members", method: "get", publico: true },
    "jugadores/detectar":          { api: "/detect/players", method: "get" },
    "pool/stats":                  { api: "/pool/stats", method: "get", publico: true },
    "eventos/stamina":             { api: "/actions/claim-stamina", method: "post" },
    "eventos/visitantes":          { api: "/actions/collect-visitors", method: "post" },
    "eventos/recompensas-inactivas": { api: "/actions/collect-idle-rewards", method: "post" },
    "eventos/camion-comercio":     { api: "/actions/dispatch-trade-truck", method: "post" },
    "eventos/correo-sistema":      { api: "/mail/system", method: "get" },
    "vs/rankings-diarias":         { api: "/vs/rankings/daily", method: "get" },
    "vs/rankings-temporada":       { api: "/vs/rankings/season", method: "get" },
    "vs/matchups":                 { api: "/vs/matchups", method: "get" },
    "vs/schedule":                 { api: "/vs/schedule", method: "get" },
    "vs/temporada":                { api: "/vs/season", method: "get" },
    "vs/grupo":                    { api: "/vs/group", method: "get" },
    "warzone/actual":              { api: "/warzone/current", method: "get" },
    "warzone/todas-rondas":        { api: "/warzone/all-rounds", method: "get" }
};

function resolverUrl(cfg, req) {
    let pathApi = cfg.api.replace(/\{(\w+)\}/g, (_, k) => req.params[k] || "");
    const params = new URLSearchParams();
    if (cfg.publico !== true && process.env.LWT_SESSION_KEY) {
        params.set("session_key", process.env.LWT_SESSION_KEY);
    }
    for (const [k, v] of Object.entries(req.query)) {
        if (v !== undefined) params.set(k, v);
    }
    const qs = params.toString();
    return `${LWT_BASE}${pathApi}` + (qs ? `?${qs}` : "");
}

for (const [ruta, cfg] of Object.entries(RUTAS_MAP)) {
    const metodo = cfg.method === "post" ? "post" : "get";
    app[metodo](`/api/lwt/${ruta}`, async (req, res) => {
        try {
            const url = resolverUrl(cfg, req);
            const response = await fetch(url, {
                method: cfg.method.toUpperCase(),
                headers: {
                    "X-API-Key": LWT_API_KEY,
                    ...(cfg.method === "post" ? { "Content-Type": "application/json" } : {})
                },
                body: cfg.method === "post" && req.body ? JSON.stringify(req.body) : undefined
            });
            const texto = await response.text();
            res.status(response.status).type("application/json").send(texto);
        } catch (e) {
            res.status(502).json({ error: e.message });
        }
    });
}

// Estado de configuración (para el frontend)
app.get("/api/lwt/status", (req, res) => {
    res.json({
        api: LWT_BASE,
        sessionKeyConfigurada: !!process.env.LWT_SESSION_KEY
    });
});

// Catálogo de endpoints expuestos por el proxy
app.get("/api/lwt", (req, res) => {
    res.json({
        base: LWT_BASE,
        publicos: Object.entries(RUTAS_MAP)
            .filter(([, c]) => c.publico === true)
            .map(([r]) => ({ ruta: `GET /api/lwt/${r}`, requiereSesion: false })),
        conSesion: Object.entries(RUTAS_MAP)
            .filter(([, c]) => c.publico !== true)
            .map(([r, c]) => ({ ruta: `${c.method.toUpperCase()} /api/lwt/${r}`, requiereSesion: true }))
    });
});

// Health check (para plataformas de despliegue como Render/Railway)
app.get("/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});

// ------------------------------------------------------------
// Servir estáticos
// ------------------------------------------------------------

// Proteger archivos sensibles de ser servidos públicamente
app.use("/", (req, res, next) => {
    const bloqueados = [".env", ".env.example", "server.js", "package.json", "package-lock.json", "render.yaml", "README.md"];
    const ruta = req.path.split("?")[0].split("/").pop().toLowerCase();
    if (bloqueados.includes(ruta)) {
        return res.status(404).end();
    }
    next();
});

// Directorio raíz del frontend (donde está este server.js)
app.use(express.static(path.join(__dirname)));

// El JS usa rutas relativas, páginas bajo /pages/
app.get("/pages/:page", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", req.params.page));
});

// 404 para rutas de API desconocidas
app.use("/api", (req, res) => {
    res.status(404).json({ error: "Endpoint no encontrado", ruta: req.originalUrl });
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor", detalle: err.message });
});

app.listen(PORT, () => {
    console.log("");
    console.log("============================================");
    console.log("Last War Guide — Frontend + Proxy");
    console.log("============================================");
    console.log(`Servidor   : http://localhost:${PORT}`);
    console.log(`API        : ${LWT_BASE}`);
    console.log(`Sesión     : ${process.env.LWT_SESSION_KEY ? "ACTIVA" : "SIN SESSION KEY"}`);
    console.log("");
});
