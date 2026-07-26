// Datos de EJEMPLO para probar la interfaz sin gastar cuota real de la API.
// La distribución de cfg_id es la real que obtuvimos en un escaneo de
// secret_tasks (1090 filas). Las coordenadas, owner_uid y act_end_time
// son generados (no reales), excepto la primera fila, que sí es un dato
// confirmado de verdad (Julka Spulka, warzone 2296).

// Conteo real observado por cfg_id (warzone 2296, filtro secret_tasks)
const CONTEO_REAL = {
    300101: 24, 300102: 12, 300103: 11, 300104: 19,
    300201: 22, 300202: 20, 300203: 20, 300204: 20,
    300301: 7,  300302: 7,  300303: 5,  300304: 5,
    400101: 25, 400102: 18, 400103: 17, 400104: 12,
    400201: 27, 400202: 41, 400203: 46, 400204: 41,
    400301: 25, 400302: 33, 400303: 30, 400304: 34,
    400401: 1,
    5000101: 6, 5000102: 8, 5000103: 5, 5000104: 8,
    5000201: 29, 5000202: 26, 5000203: 26, 5000204: 40,
    5000301: 58, 5000302: 58, 5000303: 66, 5000304: 48,
    50000401: 4, 50000402: 3, 50000403: 4, 50000404: 3,
    60000101: 102, 60000201: 48, 60000301: 25, 60000401: 1
};

// Fila real confirmada (la vimos directamente en el juego: "Julka Spulka")
const FILA_CONFIRMADA = {
    x: 863,
    y: 918,
    cfg_id: 60000101,
    owner_uid: "1543127102002295",
    act_end_time: 1785117599000, // referencia real capturada en su momento
    _confirmado: true // marca para que el frontend sepa que este SÍ es real
};

// Generador simple con semilla, para que los datos de ejemplo sean
// siempre los mismos en cada recarga (más fácil de comparar visualmente).
function crearGeneradorAleatorio(semilla) {
    let estado = semilla;
    return () => {
        estado = (estado * 1103515245 + 12345) & 0x7fffffff;
        return estado / 0x7fffffff;
    };
}

export function generarDatosPrueba() {
    const random = crearGeneradorAleatorio(42);
    const filas = [FILA_CONFIRMADA];
    const ahora = Date.now();

    // Reproducimos la proporción real observada: ~13% vigentes, ~87% expiradas
    const PROPORCION_VIGENTES = 142 / 1090;

    Object.entries(CONTEO_REAL).forEach(([cfgId, cantidad]) => {
        for (let i = 0; i < cantidad; i++) {
            const x = 700 + Math.floor(random() * 400);
            const y = 700 + Math.floor(random() * 400);
            const esVigente = random() < PROPORCION_VIGENTES;

            // Vigente: entre ahora y +48h. Expirada: entre -5 días y ahora.
            const actEndTime = esVigente
                ? ahora + Math.floor(random() * 48 * 60 * 60 * 1000)
                : ahora - Math.floor(random() * 5 * 24 * 60 * 60 * 1000);

            filas.push({
                x,
                y,
                cfg_id: Number(cfgId),
                owner_uid: String(1000000000000000 + Math.floor(random() * 900000000002296)),
                alliance_id: random() < 0.7 ? "c34c7c970d974fa2a81310b8eebdde7b" : undefined,
                act_end_time: actEndTime
            });
        }
    });

    return filas;
}
