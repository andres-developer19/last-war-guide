import { apiRequest } from "../api.js";
import { mostrarToast } from "../toast.js";

function id(s) { return document.getElementById(s); }

async function verificarSesion() {
    try {
        const status = await apiRequest("status");
        if (!status.sessionKeyConfigurada) {
            id("session-banner").style.display = "";
            id("session-banner-text").innerHTML =
                "⚠️ <strong>Sin sesión activa.</strong> Los eventos requieren cargar credenciales con el Capture Tool (LWT_SESSION_KEY).";
            return false;
        }
        id("session-banner").className = "session-banner ok";
        id("session-banner").style.display = "";
        id("session-banner-text").textContent = "✅ Sesión activa.";
        return true;
    } catch (e) {
        id("session-banner").style.display = "";
        id("session-banner-text").textContent = "⚠️ " + (e.message || "No se pudo verificar la sesión.");
        return false;
    }
}

function renderCorreo(mails) {
    const cont = id("mail-body");
    if (!Array.isArray(mails) || mails.length === 0) {
        cont.innerHTML = `<div class="empty">No hay correos en el periodo seleccionado.</div>`;
        return;
    }

    cont.innerHTML = mails.map(m => {
        const recompensa = m.rewards && m.rewards.length
            ? m.rewards.map(r => `${r.id}×${r.num}`).join(", ")
            : null;

        return `
        <div class="card" style="margin-bottom:12px;">
            <div class="row-between" style="margin-bottom:8px;">
                <strong>${m.title || "Sin título"}</strong>
                <span class="badge ${m.reward_status === 0 ? 'badge-accent' : 'badge-muted'}">
                    ${m.reward_status === 0 ? "💰 Por reclamar" : "✔ Reclamado"}
                </span>
            </div>
            <div class="card-muted" style="font-size:0.85rem;">${m.body || ""}</div>
            ${recompensa ? `<div class="badge badge-warning" style="margin-top:10px;">🎁 ${recompensa}</div>` : ""}
            ${m.type_name ? `<div class="card-muted" style="margin-top:8px;font-size:0.78rem;">${m.type_name} · ${new Date(m.send_time || m.create_time).toLocaleString()}</div>` : ""}
        </div>
    `;
    }).join("");
}

async function cargarCorreo() {
    const body = id("mail-body");
    body.innerHTML = `<div class="loading"><span class="spinner"></span> Cargando correo...</div>`;
    const days = id("mail-days").value;
    try {
        const data = await apiRequest(`eventos/correo-sistema?days=${days}`);
        if (data && data.error) throw new Error(data.error);
        renderCorreo(data.mails || data);
    } catch (e) {
        body.innerHTML = `<div class="error">Error: ${e.message}</div>`;
    }
}

const RUTAS_ACCION = {
    stamina: "eventos/stamina",
    visitantes: "eventos/visitantes",
    recompensas: "eventos/recompensas-inactivas"
};

async function ejecutarAccion(ruta, nombre, btn) {
    btn.disabled = true;
    const original = btn.innerHTML;
    btn.innerHTML = `<span class="spinner"></span>`;
    try {
        const res = await apiRequest(RUTAS_ACCION[ruta], { method: "POST" });
        if (res && res.error) throw new Error(res.error);
        mostrarToast(`✅ ${nombre} completado${res && res.message ? ": " + res.message : ""}`, "success");
    } catch (e) {
        mostrarToast(`Error en ${nombre}: ${e.message}`, "error", 6000);
    } finally {
        btn.disabled = false;
        btn.innerHTML = original;
    }
}

const ACCIONES = {
    stamina: "reclamar stamina",
    visitantes: "recolectar visitantes",
    recompensas: "recompensas inactivas"
};

function initTabs() {
    const tabs = document.querySelectorAll("#event-tabs .tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("is-active"));
            tab.classList.add("is-active");
            const target = tab.dataset.tab;
            id("tab-correo").style.display = target === "correo" ? "" : "none";
            id("tab-acciones").style.display = target === "acciones" ? "" : "none";
        });
    });
}

async function init() {
    initTabs();
    const sesion = await verificarSesion();
    if (sesion) cargarCorreo();

    id("btn-mail")?.addEventListener("click", () => sesion && cargarCorreo());

    document.querySelectorAll("[data-accion]").forEach(btn => {
        btn.addEventListener("click", () => {
            const accion = btn.dataset.accion;
            ejecutarAccion(accion, ACCIONES[accion], btn);
        });
    });
}

document.addEventListener("DOMContentLoaded", init);
