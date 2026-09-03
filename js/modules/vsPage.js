import { apiRequest } from "../api.js";

function id(s) { return document.getElementById(s); }

async function verificarSesion() {
    try {
        const status = await apiRequest("status");
        if (!status.sessionKeyConfigurada) {
            id("session-banner").style.display = "";
            id("session-banner-text").innerHTML =
                "⚠️ <strong>Sin sesión activa.</strong> El VS requiere cargar credenciales con el Capture Tool.";
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

function parsePartial(texto) {
    try { return JSON.parse(texto); } catch { return texto; }
}

async function cargar(selectorBody, nombre, ruta, render) {
    const body = id(selectorBody);
    body.innerHTML = `<div class="loading"><span class="spinner"></span> Cargando ${nombre}...</div>`;
    try {
        const res = parsePartial(await apiRequest(ruta));
        if (res && res.error) throw new Error(res.error);
        render(body, res);
    } catch (e) {
        body.innerHTML = `<div class="error">Error: ${e.message}</div>`;
    }
}

function renderRankings(body, data) {
    const lista = (data && (data.rankings || [])) || [];
    if (lista.length === 0) {
        body.innerHTML = `<div class="empty">Sin datos de rankings.</div>`;
        return;
    }
    id("vs-rk-meta").textContent = `Tipo: ${data.rank_type || "—"} · Día ${data.day || "—"}`;
    body.innerHTML = `
        <div class="table-wrap">
            <table class="table">
                <thead><tr><th>#</th><th>Jugador</th><th class="right">Puntos</th><th class="right">Alianza</th><th class="right">Server</th></tr></thead>
                <tbody>
                    ${lista.slice(0, 50).map(r => `
                        <tr>
                            <td class="num">${r.rank}</td>
                            <td><strong>${r.name || r.uid}</strong></td>
                            <td class="num right">${r.score ?? "—"}</td>
                            <td class="right card-muted">${r.alliance_abbr || "—"}</td>
                            <td class="right card-muted">${r.server_id || "—"}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function renderMatchups(body, data) {
    const lista = (data && data.matchups) || [];
    if (lista.length === 0) {
        body.innerHTML = `<div class="empty">Sin matchups.</div>`;
        return;
    }
    body.innerHTML = `<div class="grid grid-2" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr));">
        ${lista.map(m => {
            const a1 = m.alliance_1 || {};
            const a2 = m.alliance_2 || {};
            return `
            <div class="card">
                <div class="row-between" style="margin-bottom:8px;">
                    <strong>${a1.abbr || a1.name || "?"}</strong>
                    <span class="badge ${m.decided ? 'badge-success' : 'badge-muted'}">${m.decided ? "Decidido" : "Pendiente"}</span>
                    <strong>${a2.abbr || a2.name || "?"}</strong>
                </div>
            </div>`;
        }).join("")}
    </div>`;
}

function renderSchedule(body, data) {
    const lista = (data && data.schedule) || [];
    if (lista.length === 0) {
        body.innerHTML = `<div class="empty">Sin calendario.</div>`;
        return;
    }
    body.innerHTML = `
        <div class="table-wrap">
            <table class="table">
                <thead><tr><th>Día</th><th>Evento</th><th>Multiplicador</th><th>Resultado</th><th>MVP</th></tr></thead>
                <tbody>
                    ${lista.map(d => `
                        <tr>
                            <td class="num">Día ${d.day}</td>
                            <td>${d.description_id ?? d.event_id ?? "—"}</td>
                            <td class="num">${d.score_multiplier ?? "—"}</td>
                            <td>${d.is_win ? `<span class="badge badge-success">Victoria</span>` : d.is_win === 0 ? `<span class="badge badge-danger">Derrota</span>` : `<span class="badge badge-muted">—</span>`}</td>
                            <td>${d.mvp && d.mvp.name ? d.mvp.name : "—"}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function renderSeason(body, data) {
    if (!data || (!data.current && !data.previous)) {
        body.innerHTML = `<div class="empty">Sin datos de temporada.</div>`;
        return;
    }
    const resumen = (t) => `<div class="card">
        <h2 class="card-title"><span class="ico">🎖</span>${t === "current" ? "Temporada actual" : "Temporada anterior"}</h2>
        <pre class="card-muted" style="white-space:pre-wrap;font-family:var(--font-mono);font-size:0.8rem;">${JSON.stringify(data[t], null, 2)}</pre>
    </div>`;
    body.innerHTML = `<div class="grid grid-2">${resumen("current")}${resumen("previous")}</div>`;
}

function initTabs() {
    const tabs = document.querySelectorAll("#vs-tabs .tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("is-active"));
            tab.classList.add("is-active");
            const t = tab.dataset.tab;
            ["rankings", "matchups", "schedule", "season"].forEach(n =>
                id(`vs-${n}`).style.display = n === t ? "" : "none");
        });
    });
}

async function init() {
    initTabs();
    const sesion = await verificarSesion();

    id("vs-rk-btn").addEventListener("click", () => cargar("vs-rankings-body", "rankings", "vs/rankings-temporada", renderRankings));
    id("vs-mt-btn").addEventListener("click", () => cargar("vs-matchups-body", "matchups", "vs/matchups", renderMatchups));
    id("vs-sc-btn").addEventListener("click", () => cargar("vs-schedule-body", "calendario", "vs/schedule", renderSchedule));
    id("vs-sn-btn").addEventListener("click", () => cargar("vs-season-body", "temporada", "vs/temporada", renderSeason));
}

document.addEventListener("DOMContentLoaded", init);
