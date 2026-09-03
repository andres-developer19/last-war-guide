import { apiRequest } from "../api.js";
import { ALLIANCE_ID } from "../config.js";
import { formatearNumero } from "../utils.js";
import { abrirModalJugador } from "./player.js";

const contenedor = document.getElementById("roster-grid");
const contador = document.getElementById("roster-count");
const tituloEl = document.getElementById("roster-title");

function obtenerAllianceId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || ALLIANCE_ID;
}

const allianceIdActual = obtenerAllianceId();

function sortActual() {
    const sel = document.getElementById("roster-sort");
    if (!sel) return { sort_by: "power", descending: true };
    const v = sel.value;
    if (v === "power-asc") return { sort_by: "power", descending: false };
    if (v === "power-desc") return { sort_by: "power", descending: true };
    if (v === "name") return { sort_by: "name", descending: false };
    return { sort_by: "rank", descending: false };
}

async function cargarMiembros() {
    const { sort_by, descending } = sortActual();
    const data = await apiRequest(`alianza/miembros/${allianceIdActual}?sort_by=${sort_by}&descending=${descending}`);
    return Array.isArray(data) ? data : (data.members || []);
}

async function guardarEtiqueta() {
    if (!tituloEl) return;
    tituloEl.textContent = `Roster de alianza`;
    document.title = `Roster — Last War Guide`;
}

export async function cargarDatos() {
    try {
        const [miembros] = await Promise.all([
            cargarMiembros().catch(() => [])
        ]);
        guardarEtiqueta();
        renderMiembros(miembros);
    } catch (error) {
        console.error(error);
        contenedor.innerHTML = `
            <div class="roster-error">
                No se pudo cargar el roster: ${error.message}
            </div>
        `;
    }
}

function renderMiembros(miembros) {
    if (contador) contador.textContent = `${miembros.length} miembros`;
    if (miembros.length === 0) {
        contenedor.innerHTML = `<div class="roster-empty">Ningún miembro encontrado.</div>`;
        return;
    }

    // Los miembros ya vienen ordenados por la API, pero aseguramos consistencia local
    const ordenados = [...miembros].sort((a, b) => (b.power || 0) - (a.power || 0));

    contenedor.innerHTML = ordenados.map((m, i) => {
        const nombre = m.name || m.playerName || m.username || "Sin nombre";
        const poder = m.power_formatted || (m.power ? formatearNumero(m.power) : "—");
        const uid = m.uid || m.playerUid || m.playerId || "";
        const online = m.online;

        return `
            <div class="roster-tag" data-uid="${uid}" data-nombre="${nombre}" data-index="${i}">
                <div class="roster-rank">#${i + 1}</div>
                <div class="roster-name" title="${nombre}">${nombre}</div>
                <div class="roster-stats">
                    <span>${online === undefined ? "" : (online ? "🟢" : "⚪")} ${m.hq_level ? `HQ ${m.hq_level}` : ""}</span>
                    <span class="roster-power">${poder}</span>
                </div>
            </div>
        `;
    }).join("");

    activarClicks();
}

function activarClicks() {
    document.querySelectorAll(".roster-tag").forEach(tag => {
        tag.addEventListener("click", () => {
            const uid = tag.dataset.uid;
            const nombre = tag.dataset.nombre;
            abrirModalJugador(uid, nombre);
        });
    });
}

export function initBuscador() {
    const buscador = document.getElementById("roster-search-input");
    if (!buscador) return;

    buscador.addEventListener("input", e => {
        const filtro = e.target.value.toLowerCase();
        document.querySelectorAll(".roster-tag").forEach(tag => {
            const nombre = tag.querySelector(".roster-name").textContent.toLowerCase();
            tag.style.display = nombre.includes(filtro) ? "" : "none";
        });
    });

    const aplicarBtn = document.getElementById("roster-apply");
    const sel = document.getElementById("roster-sort");
    if (aplicarBtn) aplicarBtn.addEventListener("click", () => cargarDatos());
    if (sel) sel.addEventListener("change", () => cargarDatos());
}
