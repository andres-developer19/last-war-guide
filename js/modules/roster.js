import { apiRequest } from "../api.js";
import { ALLIANCE_ID } from "../config.js";
import { formatearNumero } from "../utils.js";
import { abrirModalJugador } from "./player.js";

const contenedor = document.getElementById("roster-grid");
const contador = document.getElementById("roster-count");

export async function cargarDatos() {

    try {

        const datos = await apiRequest(
            `alliances/${ALLIANCE_ID}/members`
        );

        console.log("Respuesta completa:", datos);

        const miembros = Array.isArray(datos)
            ? datos
            : (datos.members || []);

        console.log("Primer miembro:");
        console.log(miembros[0]);

        renderMiembros(miembros);

    } catch (error) {

        console.error(error);

        contenedor.innerHTML = `
            <div class="roster-error">
                No se pudo cargar el roster:
                ${error.message}
            </div>
        `;

    }

}

function renderMiembros(miembros) {

    if (contador) {

        contador.textContent = `${miembros.length} miembros`;

    }

    if (miembros.length === 0) {

        contenedor.innerHTML = `
            <div class="roster-empty">
                Ningún miembro encontrado.
            </div>
        `;

        return;

    }

    const ordenados = [...miembros].sort(
        (a, b) => (b.power || 0) - (a.power || 0)
    );

    contenedor.innerHTML = ordenados.map((m, i) => {

const nombre =
    m.playerName ||
    m.name ||
    m.username ||
    "Sin nombre";



        const poder =
            m.power
                ? formatearNumero(m.power)
                : "—";

        const warzone =
            m.warzoneName ||
            (m.warzoneId
                ? `Warzone ${m.warzoneId}`
                : "—");

        // De momento guardamos varios posibles IDs
const uid =
    m.playerUid ||
    m.playerId ||
    m.uid ||
    m.id ||
    "";

        return `
            <div
                class="roster-tag"
                data-uid="${uid}"
                data-nombre="${nombre}"
            >

                <div class="roster-rank">
                    #${i + 1}
                </div>

                <div
                    class="roster-name"
                    title="${nombre}"
                >
                    ${nombre}
                </div>

                <div class="roster-stats">
                    <span>${warzone}</span>
                    <span class="roster-power">${poder}</span>
                </div>

            </div>
        `;

    }).join("");

    activarClicks();

}

function activarClicks() {

    document
        .querySelectorAll(".roster-tag")
        .forEach(tag => {

            tag.addEventListener("click", () => {

                const uid = tag.dataset.uid;
                const nombre = tag.dataset.nombre;

                console.log("CLICK");
                console.log("UID:", uid);
                console.log("Nombre:", nombre);

                abrirModalJugador(uid, nombre);

            });

        });

}

export function initBuscador() {

    const buscador = document.getElementById(
        "roster-search-input"
    );

    if (!buscador) return;

    buscador.addEventListener("input", e => {

        const filtro = e.target.value.toLowerCase();

        document
            .querySelectorAll(".roster-tag")
            .forEach(tag => {

                const nombre = tag
                    .querySelector(".roster-name")
                    .textContent
                    .toLowerCase();

                tag.style.display =
                    nombre.includes(filtro)
                        ? ""
                        : "none";

            });

    });

}