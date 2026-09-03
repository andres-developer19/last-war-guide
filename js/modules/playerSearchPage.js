import { apiRequest } from "../api.js";

function id(s) { return document.getElementById(s); }

async function buscar() {
    const body = id("ps-body");
    const name = id("ps-name").value.trim();
    const server = id("ps-server").value.trim() || "1600";

    if (!name) {
        body.innerHTML = `<div class="empty">Escribe un nombre de jugador.</div>`;
        return;
    }

    body.innerHTML = `<div class="loading"><span class="spinner"></span> Escaneando mapa en busca de <strong>${escapeHtml(name)}</strong>...</div>`;
    try {
        const data = await apiRequest(`mundo/buscar-jugador?name=${encodeURIComponent(name)}&server_id=${server}`);
        if (data && data.error) throw new Error(data.error);

        if (!data.found || !data.player) {
            body.innerHTML = `<div class="empty">No se encontró al jugador <strong>${escapeHtml(name)}</strong> en el server ${server}.<br><span class="card-muted">Puede que no esté activo o no aparezca en el mapa escaneado.</span></div>`;
            return;
        }

        const p = data.player;
        const enAlianza = p.alliance_id ? `<a class="badge badge-accent" href="alliance.html?id=${p.alliance_id}">${p.alliance_tag}</a>` : `<span class="badge badge-muted">Sin alianza</span>`;

        body.innerHTML = `
        <div class="card">
            <div class="row-between" style="margin-bottom:14px;flex-wrap:wrap;gap:10px;">
                <div>
                    <h2 class="card-title" style="margin:0;"><span class="ico">👤</span> ${escapeHtml(p.name)}</h2>
                    <div class="card-muted" style="margin-top:4px;">UID: ${p.uid || "—"} · País: ${p.country || "—"} · Server ${p.server_id || server}</div>
                </div>
                <div class="row" style="gap:8px;">${enAlianza}</div>
            </div>

            <div class="grid grid-3" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr));">
                <div class="card" style="padding:14px;"><div class="card-muted">Coordenadas</div><strong style="font-family:var(--font-mono)">(${p.x}, ${p.y})</strong></div>
                <div class="card" style="padding:14px;"><div class="card-muted">Base (HQ)</div><strong>Nivel ${p.hq_level ?? "—"}</strong></div>
                <div class="card" style="padding:14px;"><div class="card-muted">Escudo</div>${p.shielded ? `<span class="badge badge-info">🛡 Activo</span>` : `<span class="badge badge-muted">Sin escudo</span>`}</div>
            </div>

            <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
                <a class="btn btn-primary" href="mapscan.html?x=${p.x}&y=${p.y}&server=${p.server_id || server}">Ver entorno en el mapa</a>
                ${p.alliance_id ? `<a class="btn" href="alliance.html?id=${p.alliance_id}">Ver su alianza</a>` : ""}
            </div>
        </div>`;
    } catch (e) {
        body.innerHTML = `<div class="error">Error: ${e.message}</div>`;
    }
}

function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function init() {
    id("ps-btn").addEventListener("click", buscar);
    ["ps-name", "ps-server"].forEach(n =>
        id(n).addEventListener("keydown", e => { if (e.key === "Enter") buscar(); }));
}

document.addEventListener("DOMContentLoaded", init);
