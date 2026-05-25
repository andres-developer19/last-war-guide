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
  "Viernes",
  "Sábado"
]

const dailyEvents = {

  0: {
    title: "Domingo de preparación",
    tasks: [
      "Guardar stamina",
      "Preparar mejoras",
      "Ayudar alianza"
    ]
  },

  1: {
    title: "Vs Construcción",
    tasks: [
      "Usar aceleradores",
      "Mejorar edificios",
      "Guardar radar"
    ]
  },

  2: {
    title: "Vs Investigación",
    tasks: [
      "Mejorar research",
      "Usar speedups",
      "Subir tecnología"
    ]
  },

  3: {
    title: "Vs Drone",
    tasks: [
      "Subir drone",
      "Usar componentes",
      "Mejorar gear"
    ]
  },

  4: {
    title: "Vs Héroes",
    tasks: [
      "Abrir cartas",
      "Subir experiencia",
      "Usar fragmentos"
    ]
  },

  5: {
    title: "Vs Radar",
    tasks: [
      "Completar radar",
      "Hacer rallies",
      "Farmear recursos"
    ]
  },

  6: {
    title: "Vs Guerra",
    tasks: [
      "Preparar tropas",
      "Curar unidades",
      "Participar en guerra"
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


fetch('https://api.ejemplo.com/datos')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });