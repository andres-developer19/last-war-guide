import { escanearWarzone, describirTarea } from "./modules/mapscan.js";

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
    estadoEl.textContent = "Escaneando... esto puede tardar unos segundos.";
    resultadosEl.innerHTML = "";
    resumenEl.textContent = "";

    try {
        const filas = await escanearWarzone(filtroActual);
        estadoEl.textContent = `Última búsqueda: ${new Date().toLocaleTimeString()}`;
        renderResultados(filas);
    } catch (error) {
        console.error(error);
        resultadosEl.innerHTML = `<div class="scan-error">No se pudo completar el escaneo: ${error.message}</div>`;
        estadoEl.textContent = "Error en el último intento.";
    } finally {
        botonBuscar.disabled = false;
    }
}

function renderResultados(filas) {
    resumenEl.textContent = `${filas.length} objetivos vigentes encontrados.`;

    if (filas.length === 0) {
        resultadosEl.innerHTML = `<div class="scan-empty">No hay objetivos vigentes en este momento.</div>`;
        return;
    }

    resultadosEl.innerHTML = filas.map(f => {
        const descripcion = describirTarea(f.cfg_id);
        const vence = f.act_end_time
            ? new Date(f.act_end_time).toLocaleString()
            : "—";

        return `
            <div class="scan-card">
                <div class="scan-card-coord">X: ${f.x} · Y: ${f.y}</div>
                <div class="scan-card-tipo">${descripcion.nombre}</div>
                <div class="scan-card-vence">Vence: ${vence}</div>
            </div>
        `;
    }).join("");
}
