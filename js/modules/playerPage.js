import { apiRequest } from "../api.js";

const params = new URLSearchParams(window.location.search);
const uid = params.get("uid");
const nombre = params.get("name");

const nameEl = document.getElementById("player-name");
const subtitleEl = document.getElementById("player-subtitle");
const contentEl = document.getElementById("player-content");

async function init() {
    if (nombre) {
        nameEl.textContent = nombre;
        subtitleEl.textContent = `UID: ${uid || "desconocido"}`;
    } else {
        nameEl.textContent = uid || "Jugador";
        subtitleEl.textContent = `UID: ${uid || "desconocido"}`;
    }

    if (!uid) {
        contentEl.innerHTML = `<div class="empty">No se recibió un UID de jugador.</div>`;
        return;
    }

    // lastwar.tools no expone perfil de jugador individual por UID.
    // Mostramos un estado explicativo y qué buscar.
    contentEl.innerHTML = `
        <div class="stack">
            <div class="row-between">
                <span class="card-muted">UID</span>
                <span class="num">${uid}</span>
            </div>
            <div class="empty" style="margin:0;">
                La API de lastwar.tools no ofrece un perfil detallado por UID.
                Los detalles del jugador se muestran desde el roster o el mapa.
            </div>
            <a class="btn" href="mapscan.html">↩ Consultar jugadores en el mapa</a>
        </div>
    `;
}

init();
