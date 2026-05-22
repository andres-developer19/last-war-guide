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
    title: "Domingo - Preparación",
    tasks: [
      "Guardar recursos para el VS",
      "Preparar construcciones",
      "Preparar investigaciones",
      "Guardar aceleradores",
      "Coordinar estrategias con la alianza"
    ]
  },

  1: {
    title: "Lunes - Drone & Radar",
    tasks: [
      "Tareas de radar (Guardar las tareas un día antes)",
      "Gastar energía atacando dooms o zombies",
      "Recolectar oro, hierro o madera",
      "Subir nivel del dron",
      "Abrir cofres de chip de dron",
      "NO abrir cofres de complementos de dron"
    ]
  },

  2: {
    title: "Martes - Construcción",
    tasks: [
      "Guardar construcciones terminadas para reclamar hoy",
      "Usar aceleradores de construcción",
      "Usar camiones UR",
      "Aceptar solo tareas secretas UR",
      "Usar tickets de reclutamiento de supervivientes"
    ]
  },

  3: {
    title: "Miércoles - Investigación",
    tasks: [
      "Guardar tareas de radar un día antes",
      "Investigar todo lo posible",
      "Usar aceleradores de investigación",
      "Abrir todos los cofres de complementos de dron",
      "Volver a guardar cofres al terminar el miércoles"
    ]
  },

  4: {
    title: "Jueves - Héroes",
    tasks: [
      "Usar tickets de reclutamiento de héroes",
      "Gastar experiencia de héroes",
      "Gastar fragmentos de héroes",
      "Subir Kimberly a 5 estrellas si aún no está"
    ]
  },

  5: {
    title: "Viernes - Power Day",
    tasks: [
      "Guardar tareas de radar un día antes",
      "Guardar construcciones terminadas para reclamar hoy",
      "Investigar todo lo posible",
      "Usar aceleradores de construcción",
      "Usar aceleradores de investigación",
      "Reclutar tropas y acelerarlas"
    ]
  },

  6: {
    title: "Sábado - Guerra",
    tasks: [
      "Usar aceleradores de construcción",
      "Usar aceleradores de investigación",
      "Acelerar tropas",
      "Usar camiones UR",
      "Aceptar solo tareas secretas UR",
      "SI NO VAS A ATACAR A LAS 04:00 A.M, PONER ESCUDO",
      "Atacar enemigos para conseguir puntos VS",
      "Cuanto mejores tropas tenga el enemigo, más puntos dará"
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