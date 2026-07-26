import { apiRequest } from "../api.js";

const params = new URLSearchParams(window.location.search);

const uid = params.get("uid");
const nombre = params.get("name");

const title = document.getElementById("player-name");
const subtitle = document.getElementById("player-subtitle");
const content = document.getElementById("player-content");

document.addEventListener("DOMContentLoaded", () => {

    if (!uid) {

        content.innerHTML = `
            <div class="player-error">
                No se recibió el UID del jugador.
            </div>
        `;

        return;

    }

    title.textContent = nombre || "Jugador";

    cargarJugador();

});

async function cargarJugador() {

    content.innerHTML = `
        <div class="player-loading">
            Cargando jugador...
        </div>
    `;

    try {

        const [history, squads] = await Promise.allSettled([

            apiRequest(`players/${uid}/history`),

            apiRequest(`players/${uid}/squads`)

        ]);

        subtitle.textContent = `UID: ${uid}`;

        content.innerHTML = `

            <section class="player-card">

                <h2>📈 Historial</h2>

                ${renderHistory(history)}

            </section>

            <section class="player-card">

                <h2>⚔ Escuadrones</h2>

                ${renderSquads(squads)}

            </section>

        `;

    }

    catch (error) {

        content.innerHTML = `

            <div class="player-error">

                ${error.message}

            </div>

        `;

    }

}

function renderHistory(result) {

    if (result.status !== "fulfilled") {

        return `
            <p>No se pudo cargar el historial.</p>
        `;

    }

    return `

        <pre>

${JSON.stringify(result.value, null, 2)}

        </pre>

    `;

}

function renderSquads(result) {

    if (result.status !== "fulfilled") {

        return `
            <p>No se pudieron cargar los escuadrones.</p>
        `;

    }

    return `

        <pre>

${JSON.stringify(result.value, null, 2)}

        </pre>

    `;

}