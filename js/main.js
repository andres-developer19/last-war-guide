import { initCalendar } from "./modules/calendar.js";

import {
    cargarDatos,
    initBuscador
} from "./modules/roster.js";

import { verVigenciaWarzone } from "./modules/mapscan.js";

document.addEventListener("DOMContentLoaded", async () => {

    initCalendar();
    cargarDatos();
    initBuscador();

    // Solo consultamos la vigencia de la warzone aquí (informativo).
    // El escaneo de tareas/bases en sí se dispara desde mapscan.html,
    // no automáticamente al cargar la página principal.
    try {
        const warzone = await verVigenciaWarzone();
        console.log("Vigencia de la warzone:", warzone);
    } catch (error) {
        console.error("Error consultando vigencia de warzone:", error);
    }

});
