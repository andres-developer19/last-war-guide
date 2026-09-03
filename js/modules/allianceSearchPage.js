import { apiRequest } from "../api.js";

const serverInput = document.getElementById("as-server");
const minPowerInput = document.getElementById("as-min-power");
const botonCargar = document.getElementById("as-btn-cargar");
const filtroEl = document.getElementById("as-filtro");
const estadoEl = document.getElementById("as-estado");
const resultadosEl = document.getElementById("as-resultados");

let alianzas = [];

function parsePoder(texto) {
    const t = (texto || "").trim().toUpperCase();
    if (!t) return 0;
    const mult = { "K": 1e3, "M": 1e6, "B": 1e9, "T": 1e12 };
    const m = t.match(/^([\d.]+)\s*([KMBT])?$/);
    if (!m) return Number(t) || 0;
    return parseFloat(m[1]) * (m[2] ? mult[m[2]] : 1);
}

function aNumeroPoder(p) {
    if (typeof p === "number") return p;
    return parsePoder(p);
}

async function cargarRanking() {
    const server = serverInput.value.trim() || "1600";
    botonCargar.disabled = true;
    estadoEl.textContent = "Cargando ranking...";
    resultadosEl.innerHTML = `<div class="loading"><span class="spinner"></span> Cargando alianzas del server ${server}...</div>`;

    try {
        const data = await apiRequest(`rankings/alianzas/${server}?limit=100`);
        alianzas = Array.isArray(data) ? data : (data.alliances || []);
        estadoEl.textContent = `${alianzas.length} alianzas en el server ${server}.`;
        aplicarFiltros();
    } catch (e) {
        resultadosEl.innerHTML = `<div class="error">Error: ${e.message}</div>`;
        estadoEl.textContent = "";
    } finally {
        botonCargar.disabled = false;
    }
}

function aplicarFiltros() {
    let lista = [...alianzas];

    const poderMin = parsePoder(minPowerInput.value);
    if (poderMin > 0) {
        lista = lista.filter(a => aNumeroPoder(a.power) >= poderMin);
    }

    const q = filtroEl.value.trim().toLowerCase();
    if (q) {
        lista = lista.filter(a =>
            (a.abbr || "").toLowerCase().includes(q) || (a.name || "").toLowerCase().includes(q));
    }

    estadoEl.textContent = `${lista.length} alianza(s) mostradas de ${alianzas.length}.`;
    render(lista);
}

function render(lista) {
    if (lista.length === 0) {
        resultadosEl.innerHTML = `<div class="empty">No se encontraron alianzas con esos filtros.</div>`;
        return;
    }

    resultadosEl.innerHTML = `<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr));">
        ${lista.map(a => `
            <a class="card hover" href="alliance.html?id=${encodeURIComponent(a.id)}">
                <div class="row-between">
                    <span class="badge badge-accent" style="font-size:1rem;padding:5px 14px;">${a.abbr || a.name || "?"}</span>
                    <span class="card-muted num">#${a.rank}</span>
                </div>
                <div style="margin-top:12px;font-size:0.9rem;"><strong>${a.name || "?"}</strong></div>
                <div class="card-muted" style="margin-top:6px;font-size:0.85rem;">
                    ${a.member_count}/${a.max_member_count} miembros · Líder: ${a.leader || "—"}
                </div>
                <div class="num" style="margin-top:10px;color:var(--accent);">⚔ ${a.power_formatted || a.power || "—"}</div>
            </a>
        `).join("")}
    </div>`;
}

botonCargar.addEventListener("click", cargarRanking);
serverInput.addEventListener("keydown", e => { if (e.key === "Enter") cargarRanking(); });
minPowerInput.addEventListener("input", aplicarFiltros);
filtroEl.addEventListener("input", aplicarFiltros);

cargarRanking();
