import { escanearWarzone } from "./mapscan.js";
import { generarDatosPrueba } from "./mapscanSampleData.js";
import { WARZONE } from "./config.js";

const botonBuscar = document.getElementById("scan-btn-buscar");
const modoPruebaCheckbox = document.getElementById("scan-modo-prueba");
const estadoEl = document.getElementById("scan-estado");
const resumenEl = document.getElementById("scan-resumen");
const resultadosEl = document.getElementById("scan-resultados");
const tabs = document.querySelectorAll(".scan-tab");

let filtroActual = "secret_tasks";

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        filtroActual = tab.dataset.filter;
        resultadosEl.innerHTML = "";
        resumenEl.innerHTML = "";
        estadoEl.textContent = "Sin escanear todavía.";
    });
});

botonBuscar.addEventListener("click", buscarObjetivos);

async function buscarObjetivos() {
    const usarDatosPrueba = modoPruebaCheckbox.checked;

    if (usarDatosPrueba && filtroActual !== "secret_tasks") {
        resultadosEl.innerHTML = `<div class="scan-error">Todavía no hay datos de ejemplo para "player_bases" — desmarca "datos de ejemplo" para probar con la API real, o cambia a la pestaña "Tareas secretas".</div>`;
        return;
    }

    botonBuscar.disabled = true;
    estadoEl.textContent = usarDatosPrueba
        ? "Cargando datos de ejemplo..."
        : "Escaneando (gasta 1 de tu cuota)...";
    resultadosEl.innerHTML = "";
    resumenEl.innerHTML = "";

    try {
        const filas = usarDatosPrueba
            ? generarDatosPrueba()
            : await escanearWarzone(filtroActual);

        estadoEl.textContent = `Última carga: ${new Date().toLocaleTimeString()}`;

        resumenEl.innerHTML = usarDatosPrueba
            ? `<div class="scan-modo-prueba-badge">⚠ MODO PRUEBA — estos datos NO son reales, son de ejemplo</div>`
            : "";

        console.log(`Datos ${usarDatosPrueba ? "de EJEMPLO" : "REALES"} de "${filtroActual}":`, filas);

        renderCards(filas);
    } catch (error) {
        console.error(error);
        resultadosEl.innerHTML = `<div class="scan-error">Error: ${error.message}</div>`;
        estadoEl.textContent = "Error en el último intento.";
    } finally {
        botonBuscar.disabled = false;
    }
}

// --- Utilidades de formato ---

function calcularEstadoTiempo(actEndTime) {
    if (!actEndTime) return { vigente: null, texto: "Sin dato de vencimiento" };

    const ahora = Date.now();
    const diffMs = actEndTime - ahora;
    const vigente = diffMs > 0;
    const diffAbsMs = Math.abs(diffMs);

    const horas = Math.floor(diffAbsMs / (1000 * 60 * 60));
    const dias = Math.floor(horas / 24);
    const horasRestantes = horas % 24;
    const minutos = Math.floor((diffAbsMs / (1000 * 60)) % 60);

    let duracion;
    if (dias > 0) {
        duracion = `${dias}d ${horasRestantes}h`;
    } else if (horas > 0) {
        duracion = `${horas}h ${minutos}min`;
    } else {
        duracion = `${minutos}min`;
    }

    return {
        vigente,
        texto: vigente ? `Vence en ${duracion}` : `Expiró hace ${duracion}`
    };
}

function copiarCoordenada(x, y, boton) {
    const texto = `Servidor #${WARZONE} X:${x} Y:${y}`;
    navigator.clipboard.writeText(texto).then(() => {
        const original = boton.textContent;
        boton.textContent = "¡Copiado!";
        setTimeout(() => { boton.textContent = original; }, 1500);
    });
}

// Hacemos la función accesible desde el HTML generado dinámicamente
window.__copiarCoordenada = copiarCoordenada;

// --- Render de tarjetas ---

function renderCards(filas) {
    if (filas.length === 0) {
        resultadosEl.innerHTML = `<div class="scan-empty">No hay objetivos vigentes en este momento.</div>`;
        return;
    }

    // Vigentes primero (ordenadas por las que vencen antes), luego expiradas.
    const conEstado = filas.map(f => ({ ...f, _estado: calcularEstadoTiempo(f.act_end_time) }));

    conEstado.sort((a, b) => {
        if (a._estado.vigente !== b._estado.vigente) {
            return a._estado.vigente ? -1 : 1;
        }
        return (a.act_end_time || 0) - (b.act_end_time || 0);
    });

    resultadosEl.innerHTML = conEstado.map((f, i) => {
        const claseVigencia = f._estado.vigente === true
            ? "is-vigente"
            : f._estado.vigente === false
                ? "is-expirada"
                : "";

        return `
            <div class="scan-card ${claseVigencia}">
                <div class="scan-card-coord">
                    X: ${f.x} · Y: ${f.y}
                    <button class="scan-copy-btn" onclick="window.__copiarCoordenada(${f.x}, ${f.y}, this)">Copiar</button>
                </div>
                <div class="scan-card-tipo">cfg_id: ${f.cfg_id}</div>
                <div class="scan-card-vence ${claseVigencia}">${f._estado.texto}</div>
            </div>
        `;
    }).join("");
}
