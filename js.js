const eventTitle = document.getElementById("event-title")
const tasksContainer = document.getElementById("tasks-container")
const dayText = document.getElementById("day-text")

const prevDayBtn = document.getElementById("prev-day")
const nextDayBtn = document.getElementById("next-day")

const days = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "viernes",
  "Sabado"
  ];
  
  const dailyEvents = {

  0: {
    title: "Domingo",
    tasks: [
      "Preparar recursos para el VS",
      "Guardar aceleradores",
      "Coordinar estrategias con la alianza"
    ]
  },

  1: {
    title: "Lunes",
    tasks: [
      "Tareas de radar (Guardar las tareas un dia antes)",

      "Gastar energia (Atacando dooms o bien zombies)",

      "Recolectando oro, hierro o madera (Dejarlo la noche de antes. y si estais trabajando mientras esteis en horario de trabajo dejar recolectando igual)",

      "Subir de nivel del dron (Solo subimos el nivel del dron y si nos pide piezas de dron, nos dara mas puntos)",

      "Abrir los cofres de chip de dron (Los cofres de CHIPS son los que si tenemos que abrir, TENER CUIDADO NO SON LOS COFRES DE COMPLEMENTOS DE DRON)"
    ]
  },

  2: {
    title: "Martes",
    tasks: [
      "Construccion (Intentar guardar construcciones sin abrir el regalo una vez haya terminado y abrir los regalos los MARTES, eso hara que sume puntos)",

      "Aceleradores construccion (usar todo tipo de aceleradores pero solo para las construcciones de este dia, os daran puntos por dos: Finalizar construccion y por gastar aceleradores)",

      "Camiones UR (Los MARTES solo se pondran camiones de nivel UR para que puntue bien en el vs)",

      "Tareas secretas (Los MARTES solo se cogeran tareas secretas de nivel UR) (si os quedais sin tickets avisarnos)",

      "Reclutamiento de supervivientes (Guardar tickets de reclutamientos, para que los MARTES utiliceis los de supervivientes eso hara que ganeis puntos)"
    ]
  },

  3: {
    title: "Miércoles",
    tasks: [
      "Tareas de radar (Guardar las tareas un dia antes)",

      "Investigaciones (Investigar todo lo posible el dia MIERCOLES , para que puntue todo)",

      "Aceleradores de investigación (Usar todo tipo de aceleradores de investigación solo para los MIERCOLES)",

      "Abrir los cofres de complementos de dron (Para todo el MIERCOLES abrir todo esos cofres no guardéis ninguno pero solo para el MIERCOLES una vez termine el Miércoles, volver a guardar todos)"
    ]
  },

  4: {
    title: "Jueves",
    tasks: [
      "Reclutamiento de Heroes (Guardar tickets de reclutamientos, para que los JUEVES utiliceis los de heroes eso hara que ganeis puntos)",

      "Gastar experiencia Heroe (Gastar todas las experiencia de héroes. Se consigue atacando dooms, zombies o haciendo las pruebas de los héroes)",

      "Gastar todos los fragmentos de los héroes (si no teneis a kim a 5 estrellas SUBIRLA A TOPE)"
    ]
  },

  5: {
    title: "Viernes",
    tasks: [
      "Tareas de radar (Guardar las tareas un dia antes)",

      "Construcción (Intentar guardar construcciones sin abrir el regalo una vez haya terminado y abrir los regalos los VIERNES, eso hara que sume puntos)",

      "Investigaciones (Investigar todo lo posible el dia VIERNES , para que puntue todo)",

      "Aceleradores construccion (usar todo tipo de aceleradores pero solo para las construcciones de este dia, os daran puntos por dos: Finalizar construccion y por gastar aceleradores)",

      "Aceleradores de investigación (Usar todo tipo de aceleradores de investigación para el VIERNES)",

      "Reclutar tropas y Acelerarlas (Usar todos los aceleradores posibles para conseguir el máximo de tropas el VIERNES, eso hará que ganéis la mayoría de puntos)"
    ]
  },

  6: {
    title: "Sábado",
    tasks: [
      "Aceleradores construccion (usar todo tipo de aceleradores pero solo para las construcciones de este dia, os daran puntos por gastar aceleradores)",

      "Aceleradores de investigación (Usar todo tipo de aceleradores de investigación para el SABADO)",

      "Acelerar tropas (Usar todos los aceleradores posibles para conseguir el máximo de tropas el SABADO, eso hará que ganéis la mayoría de puntos)",

      "Camiones UR (Los SABADOS solo se pondran camiones de nivel UR para que puntue bien en el vs)",

      "Tareas secretas (Los MARTES solo se cogeran tareas secretas de nivel UR) (si os quedais sin tickets avisarnos)",

      "SI NO VAIS ATACAR A LAS 04:00 A.M, TODO EL MUNDO SE PONE ESCUDO",

      "Cada muerte de soldados enemigos os darán puntos (esos puntos cuanto mejor tropas tenga el enemigo mas puntos dará)",

      "CASTIGO: Todo el que no tenga escudo será revisado por los R4/R5 y podrá ser expulsado"
    ]
  }

}
let selectedDay = new Date().getDay()

function renderDay() {

  const currentEvent = dailyEvents[selectedDay]

  dayText.textContent = `Hoy estás viendo: ${days[selectedDay]}`

  tasksContainer.innerHTML = ""

  if (currentEvent) {

    eventTitle.textContent = currentEvent.title

    currentEvent.tasks.forEach(task => {

      const taskElement = document.createElement("label")

      taskElement.classList.add("task")

      taskElement.innerHTML = `
        <input type="checkbox">
        <span>${task}</span>
      `

      tasksContainer.appendChild(taskElement)

    })

  }

}

prevDayBtn.addEventListener("click", () => {

  selectedDay--

  if (selectedDay < 0) {
    selectedDay = 6
  }

  renderDay()

})

nextDayBtn.addEventListener("click", () => {

  selectedDay++

  if (selectedDay > 6) {
    selectedDay = 0
  }

  renderDay()

})

renderDay()

async function apiRequest(ruta) {
    // Si ruta está vacía, no añadimos la barra al final
    const url = ruta
        ? `http://localhost:3000/api/lwatlas/${ruta}`
        : `http://localhost:3000/api/lwatlas`;

    const respuesta = await fetch(url);

    // Leemos como texto primero, por si el servidor no devuelve JSON válido
    const textoCrudo = await respuesta.text();

    if (!respuesta.ok) {
        throw new Error(`Error en la petición: ${respuesta.status} - ${textoCrudo}`);
    }

    try {
        return JSON.parse(textoCrudo);
    } catch {
        return textoCrudo; // devolvemos el texto tal cual si no es JSON
    }
}

async function cargarDatos() {
    const allianceId = "46f4c56a22984addbfa862973c8a7fa4";
    const contenedor = document.getElementById("roster-grid");
    const contador = document.getElementById("roster-count");

    try {
        const datos = await apiRequest(`alliances/${allianceId}/members`);
        console.log("Miembros de la alianza:", datos);

        // La API puede devolver el arreglo directo o envuelto en { members: [...] }
        const miembros = Array.isArray(datos) ? datos : (datos.members || []);

        renderMiembros(miembros, contenedor, contador);
    } catch (error) {
        console.error("Error al cargar miembros:", error);
        if (contenedor) {
            contenedor.innerHTML = `<div class="roster-error">No se pudo cargar el roster: ${error.message}</div>`;
        }
    }
}

function renderMiembros(miembros, contenedor, contador) {
    if (!contenedor) return;

    if (contador) {
        contador.textContent = `${miembros.length} miembros`;
    }

    if (miembros.length === 0) {
        contenedor.innerHTML = `<div class="roster-empty">Ningún miembro encontrado.</div>`;
        return;
    }

    // Ordenamos por poder descendente si el campo existe
    const ordenados = [...miembros].sort((a, b) => (b.power || 0) - (a.power || 0));

    contenedor.innerHTML = ordenados.map((m, i) => {
        const nombre = m.name || m.playerName || m.username || "Sin nombre";
        const poder = m.power ? formatearNumero(m.power) : "—";
        const warzone = m.warzoneName || (m.warzoneId ? `Warzone ${m.warzoneId}` : "—");
        const uid = m.playerId || m.uid || m.id || "";

        return `
            <div class="roster-tag" data-uid="${uid}" data-nombre="${nombre}">
                <div class="roster-rank">#${i + 1}</div>
                <div class="roster-name" title="${nombre}">${nombre}</div>
                <div class="roster-stats">
                    <span>${warzone}</span>
                    <span class="roster-power">${poder}</span>
                </div>
            </div>
        `;
    }).join("");

    // Click en cualquier placa abre el modal de detalle
    contenedor.querySelectorAll(".roster-tag").forEach(tag => {
        tag.addEventListener("click", () => {
            const uid = tag.dataset.uid;
            const nombre = tag.dataset.nombre;
            if (uid) {
                abrirModalJugador(uid, nombre);
            }
        });
    });
}

// --- Modal de detalle de jugador ---

async function abrirModalJugador(uid, nombre) {
    const backdrop = document.createElement("div");
    backdrop.className = "roster-modal-backdrop";
    backdrop.innerHTML = `
        <div class="roster-modal">
            <button class="roster-modal-close" aria-label="Cerrar">&times;</button>
            <span class="roster-modal-eyebrow">Ficha de jugador</span>
            <h3>${nombre}</h3>
            <div class="roster-modal-loading">Cargando datos...</div>
        </div>
    `;
    document.body.appendChild(backdrop);

    const cerrar = () => backdrop.remove();
    backdrop.querySelector(".roster-modal-close").addEventListener("click", cerrar);
    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) cerrar();
    });

    const cuerpo = backdrop.querySelector(".roster-modal");

    try {
        const [historial, escuadrones] = await Promise.allSettled([
            apiRequest(`players/${uid}/history`),
            apiRequest(`players/${uid}/squads`)
        ]);

        let html = `
            <button class="roster-modal-close" aria-label="Cerrar">&times;</button>
            <span class="roster-modal-eyebrow">Ficha de jugador</span>
            <h3>${nombre}</h3>
        `;

        html += `<div class="roster-modal-section">
            <h4>Historial</h4>
            ${historial.status === "fulfilled"
                ? `<pre>${JSON.stringify(historial.value, null, 2)}</pre>`
                : `<div class="roster-modal-error">No se pudo cargar: ${historial.reason.message}</div>`}
        </div>`;

        html += `<div class="roster-modal-section">
            <h4>Escuadrones</h4>
            ${escuadrones.status === "fulfilled"
                ? `<pre>${JSON.stringify(escuadrones.value, null, 2)}</pre>`
                : `<div class="roster-modal-error">No se pudo cargar: ${escuadrones.reason.message}</div>`}
        </div>`;

        cuerpo.innerHTML = html;
        cuerpo.querySelector(".roster-modal-close").addEventListener("click", cerrar);
    } catch (error) {
        cuerpo.innerHTML = `
            <button class="roster-modal-close" aria-label="Cerrar">&times;</button>
            <span class="roster-modal-eyebrow">Ficha de jugador</span>
            <h3>${nombre}</h3>
            <div class="roster-modal-error">Error al cargar la ficha: ${error.message}</div>
        `;
        cuerpo.querySelector(".roster-modal-close").addEventListener("click", cerrar);
    }
}

function formatearNumero(num) {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
}

// Filtro en vivo por nombre
document.addEventListener("DOMContentLoaded", () => {
    const buscador = document.getElementById("roster-search-input");
    if (buscador) {
        buscador.addEventListener("input", (e) => {
            const filtro = e.target.value.toLowerCase();
            document.querySelectorAll("#roster-grid .roster-tag").forEach(tag => {
                const nombre = tag.querySelector(".roster-name").textContent.toLowerCase();
                tag.style.display = nombre.includes(filtro) ? "" : "none";
            });
        });
    }
});

cargarDatos();