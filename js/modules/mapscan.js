import { apiRequest } from "../api.js";
import { WARZONE } from "../config.js";

export async function probarMapScan() {

    try {

        console.log("Creando job de Map Scan...");

        const respuesta = await fetch(
            "http://localhost:3000/api/lwatlas/map-scan/jobs",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    warzone: WARZONE,
                    filter: "secret_tasks"
                })
            }
        );

        const textoCrudo = await respuesta.text();

        console.log("Status:", respuesta.status);

        if (!respuesta.ok) {
            console.error(textoCrudo);
            return;
        }

        const job = JSON.parse(textoCrudo);

        if (job.status === "READY") {
            await descargarResultadosJob(job.jobId);
        }

    } catch (error) {

        console.error(error);

    }

}

async function descargarResultadosJob(jobId) {

    const respuesta = await fetch(
        `http://localhost:3000/api/lwatlas/map-scan/jobs/${jobId}/download`
    );

    const textoCrudo = await respuesta.text();

    if (!respuesta.ok) {
        console.error(textoCrudo);
        return;
    }

    const lineas = textoCrudo
        .split("\n")
        .filter(l => l.trim() !== "");

    const filas = [];

    for (const linea of lineas) {

        try {

            filas.push(JSON.parse(linea));

        } catch {}

    }

    console.log(filas);

}

export async function verVigenciaWarzone() {

    try {

        const datos = await apiRequest("warzones");

        const lista = Array.isArray(datos)
            ? datos
            : datos.warzones || [];

        const miWarzone = lista.find(w =>
            w.warzoneId == WARZONE ||
            w.id == WARZONE ||
            w.warzone == WARZONE
        );

        console.log(miWarzone);

    } catch (error) {

        console.error(error);

    }

}