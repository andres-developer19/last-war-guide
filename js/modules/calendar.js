import { days, dailyEvents } from "../data/dailyEvents.js";

let selectedDay = new Date().getDay();

export function initCalendar() {

    const eventTitle = document.getElementById("event-title");
    const tasksContainer = document.getElementById("tasks-container");
    const dayText = document.getElementById("day-text");

    const prevDayBtn = document.getElementById("prev-day");
    const nextDayBtn = document.getElementById("next-day");

    function renderDay() {

        const currentEvent = dailyEvents[selectedDay];

        dayText.textContent = `Hoy estás viendo: ${days[selectedDay]}`;

        tasksContainer.innerHTML = "";

        if (!currentEvent) return;

        eventTitle.textContent = currentEvent.title;

        currentEvent.tasks.forEach(task => {

            const taskElement = document.createElement("label");

            taskElement.classList.add("task");

            taskElement.innerHTML = `
                <input type="checkbox">
                <span>${task}</span>
            `;

            tasksContainer.appendChild(taskElement);

        });

    }

    prevDayBtn.addEventListener("click", () => {

        selectedDay--;

        if (selectedDay < 0) selectedDay = 6;

        renderDay();

    });

    nextDayBtn.addEventListener("click", () => {

        selectedDay++;

        if (selectedDay > 6) selectedDay = 0;

        renderDay();

    });

    renderDay();

}