// Header de navegación reutilizable.
// Todas las páginas están en /pages excepto index.html.

const ENLACES = [
    { archivo: "index.html", texto: "Inicio" },
    { archivo: "allianceSearch.html", texto: "Buscar alianza" },
    { archivo: "mapscan.html", texto: "Map Scan" },
    { archivo: "vs.html", texto: "VS" }
];

function paginaActual() {
    return window.location.pathname.split("/").pop() || "index.html";
}

function estaEnPages() {
    return window.location.pathname.includes("/pages/");
}

function obtenerRuta(archivo) {

    if (archivo === "index.html") {
        return estaEnPages()
            ? "../index.html"
            : "index.html";
    }

    return estaEnPages()
        ? `./${archivo}`
        : `pages/${archivo}`;
}

function crearHeader() {

    const actual = paginaActual();

    const header = document.createElement("header");

    header.className = "nav-header";

    header.innerHTML = `
        <div class="nav-marca">
            <a href="${obtenerRuta("index.html")}">
                Last War Guide
            </a>
        </div>

        <nav class="nav-links">

            ${ENLACES.map(enlace => `

                <a
                    href="${obtenerRuta(enlace.archivo)}"
                    class="nav-link ${actual === enlace.archivo ? "is-active" : ""}"
                >
                    ${enlace.texto}
                </a>

            `).join("")}

        </nav>
    `;

    document.body.prepend(header);

}

document.addEventListener("DOMContentLoaded", crearHeader);