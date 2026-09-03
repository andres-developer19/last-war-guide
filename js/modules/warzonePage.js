import { apiRequest } from "../api.js";

function id(s) { return document.getElementById(s); }

async function verificarSesion() {
    try {
        const status = await apiRequest("status");
        if (!status.sessionKeyConfigurada) {
            id("session-banner").style.display = "";
            id("session-banner-text").innerHTML =
                "⚠️ <strong>Sin sesión activa.</strong> La warzone requiere cargar credenciales con el Capture Tool.";
            return false;
        }
        id("session-banner").className = "session-banner ok";
        id("session-banner").style.display = "";
        id("session-banner-text").textContent = "✅ Sesión activa.";
        return true;
    } catch (e) {
        id("session-banner").style.display = "";
        id("session-banner-text").textContent = "⚠️ " + (e.message || "No se pudo verificar la sesión.");
        return false;
    }
}

async function cargar() {
    const body = id("wz-body");
    body.innerHTML = `<div class="loading"><span class="spinner"></span> Cargando warzone...</div>`;
    try {
        const data = await apiRequest("warzone/actual");
        if (data && data.error) throw new Error(data.error);

        const ronda = data.current_round || {};
        const rondas = (data.rounds || []).slice().reverse();
        const rankings = data.server_rankings || {};

        let html = "";

        // Ronda actual
        html += `
        <div class="card" style="margin-bottom:16px;">
            <h2 class="card-title"><span class="ico">🎯</span> Ronda actual</h2>
            <div class="grid grid-3" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr));">
                <div><div class="card-muted">Ronda</div><strong>${ronda.round ?? "—"}</strong></div>
                <div><div class="card-muted">Server</div><strong>${ronda.server_id ?? "—"}</strong></div>
                <div><div class="card-muted">VS Server</div><strong>${ronda.vs_server_id ?? "—"}</strong></div>
                <div><div class="card-muted">Puntos</div><strong>${ronda.score ?? "—"}</strong></div>
                <div><div class="card-muted">Estado</div>
                    ${ronda.win === 1 ? `<span class="badge badge-success">Victoria</span>` :
                      ronda.win === -1 ? `<span class="badge badge-danger">Derrota</span>` :
                      `<span class="badge badge-muted">Pendiente</span>`}
                </div>
            </div>
        </div>`;

        // Rankings de servers
        if (Object.keys(rankings).length) {
            const filas = Object.entries(rankings).sort((a, b) => b[1] - a[1]);
            html += `
            <div class="card" style="margin-bottom:16px;">
                <h2 class="card-title"><span class="ico">🏆</span> Rankings de servidores</h2>
                <div class="table-wrap">
                    <table class="table">
                        <thead><tr><th>#</th><th>Server</th><th class="right">Puntos</th></tr></thead>
                        <tbody>
                            ${filas.map(([srv, pts], i) => `
                                <tr><td class="num">${i + 1}</td><td>${srv}</td><td class="num right">${pts}</td></tr>`).join("")}
                        </tbody>
                    </table>
                </div>
            </div>`;
        }

        // Historial de rondas
        if (rondas.length) {
            html += `
            <div class="card">
                <h2 class="card-title"><span class="ico">📜</span> Historial de rondas</h2>
                <div class="table-wrap">
                    <table class="table">
                        <thead><tr><th>Ronda</th><th>Server</th><th class="right">Puntos</th><th>Resultado</th></tr></thead>
                        <tbody>
                            ${rondas.map(r => `
                                <tr>
                                    <td class="num">${r.round}</td>
                                    <td>${r.server_id}</td>
                                    <td class="num right">${r.score ?? "—"}</td>
                                    <td>${r.win === 1 ? `<span class="badge badge-success">Victoria</span>` :
                                         r.win === -1 ? `<span class="badge badge-danger">Derrota</span>` :
                                         `<span class="badge badge-muted">—</span>`}</td>
                                </tr>`).join("")}
                        </tbody>
                    </table>
                </div>
            </div>`;
        }

        body.innerHTML = html || `<div class="empty">Sin datos de warzone.</div>`;
    } catch (e) {
        body.innerHTML = `<div class="error">Error: ${e.message}</div>`;
    }
}

async function init() {
    await verificarSesion();
    id("wz-btn").addEventListener("click", cargar);
}

document.addEventListener("DOMContentLoaded", init);
