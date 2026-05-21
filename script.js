const eventTitle = document.getElementById("event-title")
const tasksContainer = document.getElementById("tasks-container")
const dayText = document.getElementById("day-text")

const days = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado"
]

const dailyEvents = {

  0: {
    title: "Domingo de preparación",
    tasks: [
      "Guardar stamina",
      "Completar tareas básicas",
      "Preparar mejoras",
      "Revisar investigación",
      "Ayudar a la alianza"
    ]
  },

  1: {
    title: "Vs Construcción",
    tasks: [
      "Usar aceleradores de construcción",
      "Subir edificios importantes",
      "Guardar radar para mañana",
      "Donar a tecnología de alianza",
      "Completar tareas diarias"
    ]
  },

  2: {
    title: "Vs Investigación",
    tasks: [
      "Mejorar investigaciones",
      "Usar aceleradores de research",
      "Subir poder tecnológico",
      "Guardar EXP de héroes",
      "Completar radar"
    ]
  },

  3: {
    title: "Vs Drone",
    tasks: [
      "Mejorar drone",
      "Usar componentes",
      "Subir gear",
      "Guardar fragmentos UR",
      "Preparar stamina"
    ]
  },

  4: {
    title: "Vs Héroes",
    tasks: [
      "Abrir cartas de héroes",
      "Subir experiencia de héroes",
      "Usar fragmentos de héroes",
      "Usar medallas de habilidad",
      "Guardar tareas de radar para mañana"
    ]
  },

  5: {
    title: "Vs Radar",
    tasks: [
      "Completar tareas radar",
      "Usar stamina",
      "Hacer rallies",
      "Completar tareas secretas",
      "Farmear recursos"
    ]
  },

  6: {
    title: "Vs Guerra",
    tasks: [
      "Preparar tropas",
      "Curar unidades",
      "Participar en guerras",
      "Usar boosts",
      "Coordinar con la alianza"
    ]
  }

}

const today = new Date().getDay()

dayText.textContent = `Hoy es ${days[today]}`

const currentEvent = dailyEvents[today]

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