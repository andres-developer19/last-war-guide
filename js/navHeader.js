// Header de navegación reutilizable. Se inyecta solo al inicio del <body>
// en cualquier página que importe este script — no requiere HTML manual.

const ENLACES = [
    { href: "index.html", texto: "Inicio" },
    { href: "allianceSearch.html", texto: "Buscar alianza" },
    { href: "mapscan.html", texto: "Map Scan" }
];

function paginaActual() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    return path;
}

function crearHeader() {
    const actual = paginaActual();

    const header = document.createElement("header");
    header.className = "nav-header";

    header.innerHTML = `
        <div class="nav-marca">Last War Guide</div>
        <nav class="nav-links">
            ${ENLACES.map(enlace => `
                <a
                    href="${enlace.href}"
                    class="nav-link ${enlace.href === actual ? "is-active" : ""}"
                >${enlace.texto}</a>
            `).join("")}
        </nav>
    `;

    document.body.prepend(header);
}

document.addEventListener("DOMContentLoaded", crearHeader);
