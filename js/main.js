import { initCalendar } from "./modules/calendar.js";

import {

    cargarDatos,

    initBuscador

} from "./modules/roster.js";

import {

    probarMapScan,

    verVigenciaWarzone

} from "./modules/mapscan.js";

document.addEventListener("DOMContentLoaded", () => {

    initCalendar();

    cargarDatos();

    initBuscador();

    probarMapScan();

    verVigenciaWarzone();

});