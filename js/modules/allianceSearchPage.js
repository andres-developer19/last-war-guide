import { buscarAlianzas } from "./alliances.js";

const input = document.getElementById("as-input");
const boton = document.getElementById("as-btn-buscar");
const estadoEl = document.getElementById("as-estado");
const resultadosEl = document.getElementById("as-resultados");

boton.addEventListener("click", buscar);
input.addEventListener("keydown", e => {
    if (e.key === "Enter") buscar();
});

async function buscar() {
    const etiqueta = input.value.trim();

    if (!etiqueta) {
        estadoEl.textContent = "Escribe una etiqueta para buscar.";
        return;
    }

    boton.disabled = true;
    estadoEl.textContent = "Buscando...";
    resultadosEl.innerHTML = "";

    try {
        const alianzas = await buscarAlianzas(etiqueta);
        estadoEl.textContent = `${alianzas.length} resultado(s) para "${etiqueta}".`;
        renderResultados(alianzas);
    } catch (error) {
        console.error(error);
        resultadosEl.innerHTML = `<div class="as-error">Error: ${error.message}</div>`;
        estadoEl.textContent = "";
    } finally {
        boton.disabled = false;
    }
}

function renderResultados(alianzas) {
    if (alianzas.length === 0) {
        resultadosEl.innerHTML = `<div class="as-empty">No se encontraron alianzas con esa etiqueta.</div>`;
        return;
    }

    resultadosEl.innerHTML = alianzas.map(a => {
        const tag = a.allianceAbbr || a.tag || a.name || "?";
        const miembros = a.totalMembers ?? "—";
        const warzone = a.homeWarzoneName || (a.homeWarzoneId ? `Warzone ${a.homeWarzoneId}` : "—");

        return `
            <a class="as-card" href="alliance.html?id=${encodeURIComponent(a.allianceId)}">
                <div class="as-card-tag">${tag}</div>
                <div class="as-card-info">${miembros} miembros · ${warzone}</div>
            </a>
        `;
    }).join("");
}
