import { apiRequest } from "../api.js";

function id(s) { return document.getElementById(s); }

async function cargarBloque() {
    const body = id("map-body");
    const x = id("map-x").value;
    const y = id("map-y").value;
    const server = id("map-server").value;

    body.innerHTML = `<div class="loading"><span class="spinner"></span> Consultando bloque (${x}, ${y}) server ${server}...</div>`;
    try {
        const data = await apiRequest(`mundo/bloque?x=${x}&y=${y}&server_id=${server}`);
        if (data && data.error) throw new Error(data.error);

        const bases = data.bases || [];
        const zombies = data.zombies || [];

        let html = `
        <div class="grid grid-3" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr));margin-bottom:16px;">
            <div class="card" style="padding:14px;"><div class="card-muted">Coordenadas</div><strong style="font-family:var(--font-mono)">(${data.query_x}, ${data.query_y})</strong></div>
            <div class="card" style="padding:14px;"><div class="card-muted">Bases</div><strong>${bases.length}</strong></div>
            <div class="card" style="padding:14px;"><div class="card-muted">Zombies activos</div><strong>${zombies.length}</strong></div>
        </div>`;

        // Bases
        html += `<div class="card" style="margin-bottom:16px;">
            <h2 class="card-title"><span class="ico">🏠</span> Bases encontradas (${bases.length})</h2>`;
        if (bases.length === 0) {
            html += `<div class="empty" style="margin:0;">No hay bases en este bloque.</div>`;
        } else {
            html += `<div class="table-wrap">
                <table class="table">
                    <thead><tr><th>Jugador</th><th class="right">Coords</th><th class="right">HQ</th><th>Alianza</th><th>Escudo</th></tr></thead>
                    <tbody>
                        ${bases.map(b => `
                            <tr>
                                <td><strong>${b.name || "?"}</strong>${b.uid ? `<div class="card-muted" style="font-size:0.78rem;">${b.uid}</div>` : ""}</td>
                                <td class="num right">(${b.x}, ${b.y})</td>
                                <td class="num right">${b.hq_level ?? "—"}</td>
                                <td><span class="badge badge-muted">${b.alliance_tag || "—"}</span></td>
                                <td>${b.shielded ? `<span class="badge badge-info">🛡 Sí</span>` : `<span class="badge badge-muted">No</span>`}</td>
                            </tr>`).join("")}
                    </tbody>
                </table>
            </div>`;
        }
        html += `</div>`;

        // Zombies
        if (zombies.length) {
            html += `<div class="card">
                <h2 class="card-title"><span class="ico">🧟</span> Cacerías de zombies (${zombies.length})</h2>
                <div class="table-wrap">
                    <table class="table">
                        <thead><tr><th>Monstruo</th><th class="right">Nivel</th><th class="right">Coords</th><th>Estado</th></tr></thead>
                        <tbody>
                            ${zombies.map(z => `
                                <tr>
                                    <td class="num">${z.monster_id}</td>
                                    <td class="num right">${z.monster_level ?? "—"}</td>
                                    <td class="num right">(${z.x}, ${z.y})</td>
                                    <td>${z.status === 1 ? `<span class="badge badge-warning">Activo</span>` : `<span class="badge badge-muted">—</span>`}</td>
                                </tr>`).join("")}
                        </tbody>
                    </table>
                </div>
            </div>`;
        }

        body.innerHTML = html;
    } catch (e) {
        body.innerHTML = `<div class="error">Error: ${e.message}</div>`;
    }
}

async function init() {
    const q = new URLSearchParams(window.location.search);
    if (q.get("x")) id("map-x").value = q.get("x");
    if (q.get("y")) id("map-y").value = q.get("y");
    if (q.get("server")) id("map-server").value = q.get("server");

    id("map-btn").addEventListener("click", cargarBloque);
    ["map-x", "map-y", "map-server"].forEach(n =>
        id(n).addEventListener("keydown", e => { if (e.key === "Enter") cargarBloque(); }));

    if (q.get("x") && q.get("y")) cargarBloque();
}

document.addEventListener("DOMContentLoaded", init);
