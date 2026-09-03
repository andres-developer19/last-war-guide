// Header de navegación reutilizable y rediseñado.
// Todas las páginas están en /pages excepto index.html.

const ENLACES = [
    { archivo: "index.html", texto: "Inicio" },
    { archivo: "allianceSearch.html", texto: "Alianzas" },
    { archivo: "playerSearch.html", texto: "Jugador" },
    { archivo: "vs.html", texto: "VS" },
    { archivo: "warzone.html", texto: "Warzone" },
    { archivo: "mapscan.html", texto: "Mapa" },
    { archivo: "eventos.html", texto: "Eventos" }
];

function paginaActual() {
    return window.location.pathname.split("/").pop() || "index.html";
}

function estaEnPages() {
    return window.location.pathname.includes("/pages/");
}

function obtenerRuta(archivo) {
    if (archivo === "index.html") {
        return estaEnPages() ? "../index.html" : "index.html";
    }
    return estaEnPages() ? `./${archivo}` : `pages/${archivo}`;
}

function crearHeader() {
    const actual = paginaActual();

    const header = document.createElement("header");
    header.className = "nav-header";

    header.innerHTML = `
        <div class="nav-inner">
            <div class="nav-marca">
                <span class="logo-mark">⚔</span>
                <span class="logo-text">
                    Last War Guide<em>Command Center</em>
                </span>
            </div>

            <button class="nav-toggle" aria-label="Menú">☰</button>

            <nav class="nav-links" id="nav-links">
                ${ENLACES.map(enlace => `
                    <a
                        href="${obtenerRuta(enlace.archivo)}"
                        class="nav-link ${actual === enlace.archivo ? "is-active" : ""}"
                        data-nav
                    >
                        ${enlace.texto}
                    </a>
                `).join("")}
            </nav>
        </div>
    `;

    document.body.prepend(header);

    // Menú móvil
    header.querySelector(".nav-toggle").addEventListener("click", () => {
        header.querySelector(".nav-links").classList.toggle("open");
    });
}

document.addEventListener("DOMContentLoaded", crearHeader);
