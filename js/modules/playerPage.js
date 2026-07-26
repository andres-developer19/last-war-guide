/* import { apiRequest } from "../api.js";

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

} */



    import { apiRequest } from "../api.js";

const HEROES = {
    30002: "Scarlett",
    30003: "Sarah",
    30004: "Monica",
    30005: "Farhad",

    40006: "Richard",
    40007: "Cage",
    40008: "Maxwell",
    40009: "Tesla",
    40010: "Murphy",
    40012: "Marshall",
    40013: "Violet",
    40015: "Mason",
    40016: "Venom",
    40018: "Elsa",
    40019: "Swift",
    40020: "Kimberly",

    50006: "Williams",
    50009: "Stetmann",
    50017: "Lucius",
    50019: "Fiona"
};

document.addEventListener("DOMContentLoaded", cargarJugador);

async function cargarJugador() {

    const params = new URLSearchParams(location.search);

    const uid = params.get("uid");
    const nombre = params.get("name") || "Jugador";

    if (!uid) {

        document.body.innerHTML = `
            <h2>Jugador no encontrado</h2>
        `;

        return;

    }

    document.title = nombre;

    try {

        const [history, squads] = await Promise.all([

            apiRequest(`players/${uid}/history`),

            apiRequest(`players/${uid}/squads`)

        ]);

        renderPagina(uid, nombre, history, squads);

    }

    catch (error) {

        document.body.innerHTML = `

            <div class="player-error">

                <h2>Error</h2>

                <p>${error.message}</p>

                <a href="index.html">
                    ← Volver
                </a>

            </div>

        `;

    }

}

function renderPagina(uid, nombre, history, squads) {

    const cambios = history?.changes || [];

    document.body.innerHTML = `

        <main class="player-page">

            <a
                class="back-button"
                href="index.html"
            >
                ← Volver al roster
            </a>

            <header class="player-header">

                <div class="avatar">

                    👤

                </div>

                <div>

                    <h1>${nombre}</h1>

                    <p>

                        UID:
                        ${uid}

                    </p>

                    <p>

                        Cambios:
                        ${cambios.length}

                    </p>

                </div>

            </header>

            <section>

                <h2>

                    📈 Historial

                </h2>

                <div id="timeline">

                    ${renderTimeline(cambios)}

                </div>

            </section>

            <section>

                <h2>

                    ⚔ Escuadrones

                </h2>

                <div id="squads">

                    ${renderSquads(squads)}

                </div>

            </section>

        </main>

    `;

}

function renderTimeline(cambios) {

    if (!cambios.length) {

        return `

            <div class="empty">

                No hay historial disponible.

            </div>

        `;

    }

    return cambios.map(cambio => {

        const fecha = new Date(cambio.changedAt);

        return `

            <article class="timeline-card">

                <div class="timeline-date">

                    ${fecha.toLocaleString()}

                </div>

                <div class="timeline-body">

                    ${renderCambio(cambio)}

                </div>

            </article>

        `;

    }).join("");

}

function renderCambio(cambio) {

    switch (cambio.changeType) {

        case "level_change":

            return `

                <h3>

                    🏰 Nivel

                </h3>

                <p>

                    ${cambio.oldValue}
                    →
                    ${cambio.newValue}

                </p>

            `;

        case "alliance_change": {

            const oldAlliance = JSON.parse(cambio.oldValue);

            const newAlliance = JSON.parse(cambio.newValue);

            return `

                <h3>

                    🤝 Alianza

                </h3>

                <p>

                    ${oldAlliance.abbr}

                    →

                    ${newAlliance.abbr}

                </p>

            `;

        }

        case "rank_change": {

            const oldRank = JSON.parse(cambio.oldValue);

            const newRank = JSON.parse(cambio.newValue);

            return `

                <h3>

                    ⭐ Rango

                </h3>

                <p>

                    R${oldRank.rank}

                    →

                    R${newRank.rank}

                </p>

            `;

        }

        default:

            return `

                <pre>

${JSON.stringify(cambio, null, 2)}

                </pre>

            `;

    }

}

function renderSquads(data) {

    if (!data || !data.sources?.length) {

        return `

            <div class="empty">

                No hay escuadrones registrados.

            </div>

        `;

    }

    return data.sources.map(source => `

        <section class="source-block">

            <h3>

                ${source.source === "truck"
                    ? "🚚 Camiones"
                    : "⚔ Escuadrones"}

            </h3>

            <div class="squad-list">

                ${source.squads
                    .sort((a, b) => a.squadNo - b.squadNo)
                    .map(renderSquad)
                    .join("")}

            </div>

        </section>

    `).join("");

}

function renderSquad(squad) {

    return `

        <article class="squad-card">

            <div class="squad-header">

                <div>

                    <strong>

                        Escuadrón ${squad.squadNo}

                    </strong>

                </div>

                <div>

                    ${formatearNumero(squad.squadPower)}

                </div>

            </div>

            <div class="heroes">

                ${squad.heroes
                    .sort((a, b) => a.slotIndex - b.slotIndex)
                    .map(renderHero)
                    .join("")}

            </div>

            <div class="squad-footer">

                <small>

                    Visto:

                    ${new Date(squad.observedAt)
                        .toLocaleString()}

                </small>

            </div>

        </article>

    `;

}

function renderHero(hero) {

    const nombre = HEROES[hero.heroCfgId] || hero.heroCfgId;

    return `

        <div class="hero-card">

            <div class="hero-name">

                ${nombre}

            </div>

            <div class="hero-info">

                <span>

                    Lv ${hero.heroLevel}

                </span>

                <span>

                    ⭐ ${hero.heroRank}

                </span>

                <span>

                    🔫 ${hero.heroWeaponLevel || 0}

                </span>

            </div>

        </div>

    `;

}

function formatearNumero(numero) {

    if (!numero) return "0";

    return Number(numero).toLocaleString("es-ES");

}