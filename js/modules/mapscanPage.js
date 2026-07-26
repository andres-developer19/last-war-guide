import { escanearWarzone } from "./modules/mapscan.js";
import { generarDatosPrueba } from "./modules/mapscanSampleData.js";

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
            ? `<div class="scan-modo-prueba-badge">⚠ MODO PRUEBA — estos datos NO son reales, son de ejemplo</div>
               <div>${filas.length} filas de ejemplo (filtro: ${filtroActual})</div>`
            : `<div>${filas.length} filas recibidas (filtro: ${filtroActual})</div>`;

        console.log(`Datos ${usarDatosPrueba ? "de EJEMPLO" : "REALES"} de "${filtroActual}":`, filas);

        renderCrudo(filas);
    } catch (error) {
        console.error(error);
        resultadosEl.innerHTML = `<div class="scan-error">Error: ${error.message}</div>`;
        estadoEl.textContent = "Error en el último intento.";
    } finally {
        botonBuscar.disabled = false;
    }
}

function renderCrudo(filas) {
    if (filas.length === 0) {
        resultadosEl.innerHTML = `<div class="scan-empty">Sin resultados.</div>`;
        return;
    }

    resultadosEl.innerHTML = `
        <div class="scan-raw-info">
            Mostrando las primeras 20 de ${filas.length} filas.
            El resto está disponible en la consola del navegador.
        </div>
        <pre class="scan-raw">${JSON.stringify(filas.slice(0, 20), null, 2)}</pre>
    `;
}
