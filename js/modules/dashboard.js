import { apiRequest } from "../api.js";
import { SERVER_ID } from "../config.js";

function id(sel) { return document.getElementById(sel); }

function formatoNumero(n) {
    if (n == null) return "—";
    if (n >= 1000000000) return (n / 1000000000).toFixed(2) + "B";
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return String(n);
}

async function cargarEstadoSesion() {
    try {
        const status = await apiRequest("status");
        const banner = id("session-banner");
        const texto = id("session-banner-text");

        if (status.sessionKeyConfigurada) {
            banner.className = "session-banner ok";
            texto.textContent = "✅ Sesión activa — puedes consultar eventos, VS, warzone y acciones.";
        } else {
            banner.className = "session-banner warn";
            banner.style.display = "";
            texto.innerHTML = "⚠️ <strong>Sin sesión activa.</strong> Los datos de eventos/VS/warzone requieren cargar credenciales con el Capture Tool. Las alianzas y rankings sí están disponibles.";
        }
    } catch (e) {
        id("session-banner").style.display = "";
        id("session-banner-text").textContent = "⚠️ " + (e.message || "No se pudo verificar la sesión.");
    }
}

async function cargarRankings() {
    const body = id("rankings-body");
    try {
        const data = await apiRequest(`rankings/alianzas/${SERVER_ID}?limit=10`);
        const lista = Array.isArray(data) ? data : (data.alliances || []);

        if (lista.length === 0) {
            body.innerHTML = `<tr><td colspan="5"><div class="empty">Sin datos de rankings.</div></td></tr>`;
            return;
        }

        body.innerHTML = lista.map((a, i) => `
            <tr>
                <td class="num">${i + 1}</td>
                <td><strong>${a.abbr || a.name}</strong>${a.name && a.abbr !== a.name ? ` <span class="card-muted">· ${a.name}</span>` : ""}</td>
                <td class="num right" style="color:var(--accent)">${a.power_formatted || formatoNumero(a.power)}</td>
                <td class="num right">${a.member_count || "—"}<span class="card-muted">/${a.max_member_count || "?"}</span></td>
                <td class="right card-muted">${a.leader || "—"}</td>
            </tr>
        `).join("");
    } catch (e) {
        body.innerHTML = `<tr><td colspan="5"><div class="error">Error: ${e.message}</div></td></tr>`;
    }
}

async function cargarReino() {
    const cont = id("kingdom-body");
    try {
        const data = await apiRequest(`reino/posiciones/${SERVER_ID}`);
        const lista = Array.isArray(data) ? data : [];

        if (lista.length === 0) {
            cont.innerHTML = `<div class="empty">Sin posiciones en el reino.</div>`;
            return;
        }

        const iconos = { "10001": "👑", "10002": "⭐" };

        cont.innerHTML = lista
            .filter(p => p.player_name)
            .map(p => `
            <div class="row-between" style="padding:9px 0; border-bottom:1px solid var(--border);">
                <div>
                    <span class="card-muted">${iconos[p.position_id] || "•"}</span>
                    <strong style="margin-left:8px;">${p.player_name}</strong>
                    <div class="card-muted" style="font-size:0.78rem; margin-left:24px;">${p.position_name}${p.alliance_abbr ? ` · ${p.alliance_abbr}` : ""}</div>
                </div>
            </div>
        `).join("");
    } catch (e) {
        cont.innerHTML = `<div class="error">Error: ${e.message}</div>`;
    }
}

async function cargarPool() {
    const cont = id("pool-body");
    try {
        const data = await apiRequest("pool/stats");
        const c = (data.connections && data.connections.main) || {};
        cont.innerHTML = `
            <div class="stack" style="gap:12px;">
                <div class="row-between">
                    <span class="card-muted">Estado</span>
                    <span class="badge badge-success">${c.state || data.status || "—"}</span>
                </div>
                <div class="row-between">
                    <span class="card-muted">Conexiones listas</span>
                    <span class="num">${data.ready_connections ?? data.total_connections ?? "—"}</span>
                </div>
                <div class="row-between">
                    <span class="card-muted">Peticiones OK</span>
                    <span class="num">${c.requests_completed ?? "—"}</span>
                </div>
                <div class="row-between">
                    <span class="card-muted">Fallidas</span>
                    <span class="num" style="color:var(--danger)">${c.requests_failed ?? "—"}</span>
                </div>
                <div class="row-between">
                    <span class="card-muted">Reconexiones</span>
                    <span class="num">${c.reconnect_count ?? "—"}</span>
                </div>
            </div>
        `;
    } catch (e) {
        cont.innerHTML = `<div class="error">Error: ${e.message}</div>`;
    }
}

async function cargarStatusGrid() {
    const cont = id("status-grid");
    cont.innerHTML = `
        <div class="card hover"><h2 class="card-title"><span class="ico">👑</span>Reino</h2><div class="card-muted" id="sg-reino">Cargando...</div></div>
        <div class="card hover"><h2 class="card-title"><span class="ico">🏆</span>Rankings</h2><div class="card-muted" id="sg-rank">Cargando...</div></div>
        <div class="card hover"><h2 class="card-title"><span class="ico">🔌</span>API</h2><div class="card-muted" id="sg-pool">Cargando...</div></div>
    `;
}

export async function init() {
    cargarStatusGrid();
    await cargarEstadoSesion();
    await cargarRankings();
    await cargarReino();
    await cargarPool();
}

document.addEventListener("DOMContentLoaded", init);
