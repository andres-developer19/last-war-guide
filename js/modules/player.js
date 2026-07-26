/* import { apiRequest } from "../api.js";

export async function abrirModalJugador(uid, nombre) {

    // Evita abrir dos modales
    document.querySelector(".roster-modal-backdrop")?.remove();

    const backdrop = document.createElement("div");

    backdrop.className = "roster-modal-backdrop";

    backdrop.innerHTML = `

    <div class="roster-modal">

        <button class="roster-modal-close">&times;</button>

        <div class="player-header">

            <div class="player-avatar">
                👤
            </div>

            <div class="player-info">

                <h2>${nombre}</h2>

                <span class="player-subtitle">
                    Cargando información...
                </span>

            </div>

        </div>

        <div class="player-body">

            <div class="player-loading">

                Cargando datos del jugador...

            </div>

        </div>

    </div>

    `;

    document.body.appendChild(backdrop);

    const cerrar = () => backdrop.remove();

    backdrop
        .querySelector(".roster-modal-close")
        .addEventListener("click", cerrar);

    backdrop.addEventListener("click", e => {

        if (e.target === backdrop)
            cerrar();

    });

    const body = backdrop.querySelector(".player-body");

    try {

        const [history, squads] = await Promise.allSettled([

            apiRequest(`players/${uid}/history`),

            apiRequest(`players/${uid}/squads`)

        ]);

        let historial = null;
        let escuadrones = null;

        if (history.status === "fulfilled") {

            historial = history.value;

        }

        if (squads.status === "fulfilled") {

            escuadrones = squads.value;

        }

        const subtitle = backdrop.querySelector(".player-subtitle");

        subtitle.textContent = "Datos obtenidos correctamente";

        body.innerHTML = `

        <div class="player-grid">

            <div class="player-card">

                <h3>📈 Historial</h3>

                ${renderHistorial(historial)}

            </div>

            <div class="player-card">

                <h3>⚔ Escuadrones</h3>

                ${renderSquads(escuadrones)}

            </div>

        </div>

        `;

    }

    catch (error) {

        body.innerHTML = `

            <div class="player-error">

                ${error.message}

            </div>

        `;

    }

}

function renderHistorial(data) {

    if (!data) {

        return `
            <p>No disponible</p>
        `;

    }

    return `

        <pre>

${JSON.stringify(data, null, 2)}

        </pre>

    `;

}

function renderSquads(data) {

    if (!data) {

        return `
            <p>No disponible</p>
        `;

    }

    return `

        <pre>

${JSON.stringify(data, null, 2)}

        </pre>

    `;

} */


    export function abrirModalJugador(uid, nombre) {

    if (!uid) {
        console.error("UID del jugador no válido");
        return;
    }

    const params = new URLSearchParams({
        uid,
        name: nombre
    });

    window.location.href = `player.html?${params.toString()}`;

}