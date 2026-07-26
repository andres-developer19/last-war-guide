

// --- Prueba: Map Scan de tareas secretas ---

async function probarMapScan() {
    const warzone = 2296; // la warzone de tu alianza CVeN

    try {
        console.log("Creando job de Map Scan...");
        const respuesta = await fetch("http://localhost:3000/api/lwatlas/map-scan/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ warzone, filter: "secret_tasks" })
        });

        const textoCrudo = await respuesta.text();
        console.log("Status:", respuesta.status);
        console.log("Respuesta cruda:", textoCrudo);

        if (!respuesta.ok) {
            console.error("El job no se pudo crear. Revisa el mensaje de error de arriba — probablemente liste los valores válidos de 'filter'.");
            return;
        }

        const job = JSON.parse(textoCrudo);
        console.log("Job creado:", job);

        if (job.status === "READY") {
            await descargarResultadosJob(job.jobId);
        }
    } catch (error) {
        console.error("Error al probar Map Scan:", error);
    }
}

async function descargarResultadosJob(jobId) {
    console.log(`Descargando resultados del job ${jobId}...`);

    const respuesta = await fetch(`http://localhost:3000/api/lwatlas/map-scan/jobs/${jobId}/download`);
    const textoCrudo = await respuesta.text();

    if (!respuesta.ok) {
        console.error("Error al descargar:", textoCrudo);
        return;
    }

    // NDJSON: una línea = un objeto JSON.
    // Si la conexión se cortó justo a media línea, esa última línea puede estar
    // incompleta — la ignoramos en vez de que rompa todo el parseo.
    const lineas = textoCrudo.split("\n").filter(linea => linea.trim() !== "");
    const filas = [];
    let lineasCorruptas = 0;

    for (const linea of lineas) {
        try {
            filas.push(JSON.parse(linea));
        } catch {
            lineasCorruptas++;
        }
    }

    if (lineasCorruptas > 0) {
        console.warn(`${lineasCorruptas} línea(s) no se pudieron parsear (probablemente el corte final).`);
    }

    console.log(`Se descargaron ${filas.length} tareas secretas.`);

    // Agrupamos por cfg_id para identificar cuáles corresponden a qué tipo/rareza.
    // No sabemos aún el mapeo cfg_id -> nombre/UR, así que mostramos el conteo
    // de cada uno para que puedas identificarlos por tu conocimiento del juego.
    const conteoPorTipo = {};
    filas.forEach(f => {
        conteoPorTipo[f.cfg_id] = (conteoPorTipo[f.cfg_id] || 0) + 1;
    });

    console.log("Tipos de tarea encontrados (cfg_id: cantidad):");
    console.log(JSON.stringify(conteoPorTipo, null, 2));

    // HIPÓTESIS (sin confirmar): los últimos 2 dígitos del cfg_id podrían
    // indicar la rareza -> 01=R, 02=SR, 03=SSR, 04=UR.
    // Descomenta esto solo después de confirmar en el juego que un cfg_id
    // terminado en 04 es efectivamente UR.
    /*
    const soloUR = filas.filter(f => f.cfg_id % 100 === 4);
    console.log(`Tareas presuntamente UR: ${soloUR.length}`, soloUR);
    */
    console.log("Primeras 5 (copia este bloque completo):");
    console.log(JSON.stringify(filas.slice(0, 5), null, 2));
}

probarMapScan();

// --- Verificar vigencia de los datos ---

async function verVigenciaWarzone() {
    try {
        const datos = await apiRequest("warzones");
        const miWarzone = (Array.isArray(datos) ? datos : datos.warzones || [])
            .find(w => w.warzoneId === 2296);

        if (miWarzone) {
            console.log("Vigencia de tu warzone:", miWarzone);
        } else {
            console.log("Todas las warzones:", datos);
        }
    } catch (error) {
        console.error("Error consultando /warzones:", error);
    }
}

verVigenciaWarzone();