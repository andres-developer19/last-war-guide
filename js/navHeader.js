// Header de navegación reutilizable.
// Funciona tanto desde la raíz como desde /pages.

const ENLACES = [
    { archivo: "index.html", texto: "Inicio" },
    { archivo: "allianceSearch.html", texto: "Buscar alianza" },
    { archivo: "mapscan.html", texto: "Map Scan" }
];

function paginaActual() {
    return window.location.pathname.split("/").pop() || "index.html";
}

function obtenerPrefijo() {
    // Si estamos dentro de /pages volvemos un nivel.
    return window.location.pathname.includes("/pages/") ? "../" : "pages/";
}

function crearHeader() {
    const actual = paginaActual();
    const prefijo = obtenerPrefijo();

    const header = document.createElement("header");
    header.className = "nav-header";

    header.innerHTML = `
        <div class="nav-marca">
            <a href="${prefijo === "pages/" ? "index.html" : "../index.html"}">
                Last War Guide
            </a>
        </div>

        <nav class="nav-links">
            ${ENLACES.map(enlace => {
                const href =
                    enlace.archivo === "index.html"
                        ? `${prefijo === "pages/" ? "" : "../"}index.html`
                        : `${prefijo}${enlace.archivo}`;

                return `
                    <a
                        href="${href}"
                        class="nav-link ${enlace.archivo === actual ? "is-active" : ""}"
                    >
                        ${enlace.texto}
                    </a>
                `;
            }).join("")}
        </nav>
    `;

    document.body.prepend(header);
}

document.addEventListener("DOMContentLoaded", crearHeader);