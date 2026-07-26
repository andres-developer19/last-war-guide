import { escanearWarzone } from "./mapscan.js";

const botonBuscar = document.getElementById("scan-btn-buscar");
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
        resumenEl.textContent = "";
        estadoEl.textContent = "Sin escanear todavía.";
    });
});

botonBuscar.addEventListener("click", buscarObjetivos);

async function buscarObjetivos() {
    botonBuscar.disabled = true;
    estadoEl.textContent = "Escaneando...";
    resultadosEl.innerHTML = "";
    resumenEl.textContent = "";

    try {
        const filas = await escanearWarzone(filtroActual);
        estadoEl.textContent = `Última búsqueda: ${new Date().toLocaleTimeString()}`;
        resumenEl.textContent = `${filas.length} filas recibidas (filtro: ${filtroActual})`;

        console.log(`Datos crudos de "${filtroActual}":`, filas);

        renderCrudo(filas);
    } catch (error) {
        console.error(error);
        resultadosEl.innerHTML = `<div class="scan-error">Error: ${error.message}</div>`;
        estadoEl.textContent = "Error en el último intento.";
    } finally {
        botonBuscar.disabled = false;
    }
}

// Muestra los datos tal cual vienen, sin suponer nada sobre su significado.
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
