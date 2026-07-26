import { API_URL } from "./config.js";

export async function apiRequest(ruta = "") {

    const url = ruta
        ? `${API_URL}/${ruta}`
        : API_URL;

    const respuesta = await fetch(url);

    const textoCrudo = await respuesta.text();

    if (!respuesta.ok) {

        throw new Error(
            `Error en la petición: ${respuesta.status} - ${textoCrudo}`
        );

    }

    try {

        return JSON.parse(textoCrudo);

    } catch {

        return textoCrudo;

    }

}