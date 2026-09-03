// Utilidad de notificaciones toast reutilizable.

let wrap = null;

function contenedor() {
    if (!wrap) {
        wrap = document.createElement("div");
        wrap.className = "toast-wrap";
        document.body.appendChild(wrap);
    }
    return wrap;
}

export function mostrarToast(mensaje, tipo = "info", duracion = 4000) {
    const iconos = { success: "✅", error: "❌", info: "ℹ️" };
    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    toast.setAttribute("role", "status");
    toast.innerHTML = `
        <span class="toast-icon">${iconos[tipo] || "ℹ️"}</span>
        <span class="toast-msg"></span>
    `;
    toast.querySelector(".toast-msg").textContent = mensaje;
    contenedor().appendChild(toast);

    const quitar = () => toast.remove();
    const timer = setTimeout(quitar, duracion);

    toast.addEventListener("click", () => {
        clearTimeout(timer);
        quitar();
    });
}
