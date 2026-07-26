// server.js
// Servidor proxy local muy simple para esquivar el problema de CORS
// con la API de LWAtlas mientras trabajas en local.

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const https = require('https');

const app = express();
const PORT = 3000;

// ⚠️ Pon aquí tu API key. Si vas a subir esto a un repo público,
// usa variables de entorno en vez de dejarla escrita aquí.
const API_KEY = 'lwa_live_ubkzXLe4SEFkCW3Rnwfu_M-hB3p2E6yW';

// Permite que tu página local (ej: file:// o localhost) llame a este proxy
app.use(cors());
app.use(express.json());

// Ruta para explorar la raíz de la API (sin nada después de /api/lwatlas)
app.get('/api/lwatlas', (req, res) => explorar('', req, res));

// POST para crear un trabajo de Map Scan (requiere Idempotency-Key)
app.post('/api/lwatlas/map-scan/jobs', async (req, res) => {
  const targetUrl = 'https://api.lwatlas.com/v1/map-scan/jobs';
  console.log('--- Creando job de Map Scan:', JSON.stringify(req.body));

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json',
        // Si el frontend no manda su propia Idempotency-Key, generamos una
        'Idempotency-Key': req.headers['idempotency-key'] || crypto.randomUUID()
      },
      body: JSON.stringify(req.body)
    });

    const textoCrudo = await response.text();
    console.log('Status recibido:', response.status);
    console.log('Cuerpo recibido:', textoCrudo);

    try {
      res.status(response.status).json(JSON.parse(textoCrudo));
    } catch {
      res.status(response.status).send(textoCrudo);
    }
  } catch (err) {
    console.error('Error creando job:', err);
    res.status(500).json({ error: 'Fallo al contactar la API', detalle: err.message });
  }
});

// Ruta específica para descargar resultados de Map Scan (NDJSON, puede ser grande).
// Usamos https nativo en vez de fetch, porque fetch falla con "terminated"
// en respuestas grandes en algunas versiones recientes de Node.
app.get('/api/lwatlas/map-scan/jobs/:jobId/download', (req, res) => {
  descargarConReintentos(`https://api.lwatlas.com/v1/map-scan/jobs/${req.params.jobId}/download`, res, 1);
});

const MAX_INTENTOS_DESCARGA = 5;

function descargarConReintentos(url, res, intento) {
  console.log(`=== Intento de descarga ${intento}/${MAX_INTENTOS_DESCARGA} ===`);

  descargarConHttps(url, 0, (error, cuerpo, statusCode) => {
    if (!error) {
      console.log(`Descarga completa en el intento ${intento} (${cuerpo.length} caracteres)`);
      const soloVigentes = analizarYFiltrarNdjson(cuerpo);
      return res.status(statusCode).send(soloVigentes);
    }

    console.error(`Intento ${intento} falló:`, error.message);

    if (intento >= MAX_INTENTOS_DESCARGA) {
      return res.status(500).json({
        error: 'La descarga se cortó repetidamente',
        detalle: error.message,
        sugerencia: 'La conexión se está cerrando del lado de la API antes de terminar. Prueba de nuevo en unos minutos, o consulta con LWAtlas si el problema persiste.'
      });
    }

    setTimeout(() => {
      descargarConReintentos(url, res, intento + 1);
    }, 1500);
  });
}

// Analiza el NDJSON, muestra el resumen en terminal, y devuelve SOLO las filas
// vigentes (act_end_time en el futuro) como NDJSON, listas para el frontend.
function analizarYFiltrarNdjson(textoCrudo) {
  const lineas = textoCrudo.split('\n').filter(l => l.trim() !== '');
  const filas = [];
  let corruptas = 0;

  for (const linea of lineas) {
    try {
      filas.push(JSON.parse(linea));
    } catch {
      corruptas++;
    }
  }

  console.log(`\n=== ANÁLISIS DEL RESULTADO (${filas.length} filas, ${corruptas} corruptas) ===`);

  const conteoPorTipo = {};
  filas.forEach(f => {
    conteoPorTipo[f.cfg_id] = (conteoPorTipo[f.cfg_id] || 0) + 1;
  });
  console.log('Tipos de tarea (cfg_id: cantidad):');
  console.log(JSON.stringify(conteoPorTipo, null, 2));

  const ahora = Date.now();
  const vigentes = filas.filter(f => f.act_end_time && f.act_end_time > ahora);
  const expiradas = filas.filter(f => f.act_end_time && f.act_end_time <= ahora);

  console.log(`Vigentes (act_end_time futuro): ${vigentes.length}`);
  console.log(`Expiradas (act_end_time pasado): ${expiradas.length}`);
  console.log('Enviando solo las vigentes al frontend.');
  console.log('=== FIN DEL ANÁLISIS ===\n');

  // Reconstruimos como NDJSON (una línea por fila) para mantener el mismo formato
  return vigentes.map(f => JSON.stringify(f)).join('\n');
}

function descargarConHttps(url, redirectCount, callback) {
  console.log('--- Descargando (https nativo):', url);

  const opciones = {
    headers: { 'X-Api-Key': API_KEY },
    timeout: 20000
  };

  const req = https.get(url, opciones, (respuestaExterna) => {
    console.log('Status recibido:', respuestaExterna.statusCode);

    if ([301, 302, 303, 307, 308].includes(respuestaExterna.statusCode) && respuestaExterna.headers.location) {
      respuestaExterna.resume();
      if (redirectCount >= 5) {
        return callback(new Error('Demasiadas redirecciones'));
      }
      return descargarConHttps(respuestaExterna.headers.location, redirectCount + 1, callback);
    }

    let chunks = [];
    let totalBytes = 0;

    respuestaExterna.on('data', (chunk) => {
      chunks.push(chunk);
      totalBytes += chunk.length;
    });

    respuestaExterna.on('end', () => {
      const cuerpo = Buffer.concat(chunks).toString('utf-8');
      callback(null, cuerpo, respuestaExterna.statusCode);
    });

    respuestaExterna.on('error', (err) => {
      console.error(`Conexión cortada tras ${totalBytes} bytes:`, err.message);

      // La API de LWAtlas a veces no cierra bien la conexión (falta el chunk final),
      // pero si ya recibimos datos, probablemente el archivo esté completo igual.
      // Tratamos esto como éxito en vez de descartar todo y reintentar.
      if (err.message === 'aborted' && chunks.length > 0) {
        console.log('La conexión se cortó pero ya teníamos datos — los usamos igual.');
        const cuerpo = Buffer.concat(chunks).toString('utf-8');
        return callback(null, cuerpo, respuestaExterna.statusCode);
      }

      callback(err);
    });
  });

  req.on('timeout', () => {
    req.destroy();
    callback(new Error('Timeout esperando respuesta de la API'));
  });

  req.on('error', (err) => {
    callback(err);
  });
}

// Ruta específica para /warzones: además de devolver los datos, analiza
// en la terminal la estructura y el estado de una warzone en particular.
app.get('/api/lwatlas/warzones', async (req, res) => {
  const targetUrl = 'https://api.lwatlas.com/v1/warzones';
  console.log('--- Llamando a:', targetUrl);

  try {
    const response = await fetch(targetUrl, {
      headers: { 'X-Api-Key': API_KEY, 'Accept-Encoding': 'identity' }
    });

    const textoCrudo = await response.text();
    console.log('Status recibido:', response.status);
    console.log(`Cuerpo recibido (${textoCrudo.length} caracteres)`);

    const data = JSON.parse(textoCrudo);
    const lista = Array.isArray(data) ? data : (data.warzones || []);

    console.log(`\n=== ANÁLISIS DE WARZONES (${lista.length} en total) ===`);
    console.log('Ejemplo de estructura:', JSON.stringify(lista[0], null, 2));

    const miWarzone = lista.find(w => w.id == 2296);
    console.log('Tu warzone (id 2296):', JSON.stringify(miWarzone, null, 2));
    console.log('=== FIN DEL ANÁLISIS ===\n');

    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error consultando warzones:', err.message);
    res.status(500).json({ error: 'Fallo al contactar la API', detalle: err.message });
  }
});

// Cualquier petición GET a /api/lwatlas/algo se reenvía a la API real
// (esto ya cubre /services; map-scan y warzones tienen sus propias rutas arriba)
app.get('/api/lwatlas/*path', (req, res) => {
  const path = req.params.path.join('/'); // lo que venga después de /api/lwatlas/
  explorar(path, req, res);
});

async function explorar(path, req, res) {
  // Reenviamos también los query params que venían en la petición del navegador
  // (ej: ?allianceName=SUN), porque los endpoints reales de LWAtlas los necesitan.
  const queryString = new URLSearchParams(req.query).toString();
  const targetUrl = `https://api.lwatlas.com/v1/${path}${queryString ? `?${queryString}` : ''}`;
  console.log('--- Llamando a:', targetUrl);

  const MAX_INTENTOS = 3;

  for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
    try {
      const response = await fetch(targetUrl, {
        headers: {
          'X-Api-Key': API_KEY,
          'Accept-Encoding': 'identity' // evita problemas de descompresión en respuestas grandes (NDJSON)
        }
      });

      const textoCrudo = await response.text(); // leemos como texto SIEMPRE, sea o no JSON
      console.log('Status recibido:', response.status);
      console.log(`Cuerpo recibido (${textoCrudo.length} caracteres)`);

      // Intentamos parsear como JSON; si falla, devolvemos el texto tal cual
      try {
        const data = JSON.parse(textoCrudo);
        return res.status(response.status).json(data);
      } catch {
        return res.status(response.status).send(textoCrudo);
      }
    } catch (err) {
      console.error(`Intento ${intento}/${MAX_INTENTOS} falló:`, err.message);

      if (intento === MAX_INTENTOS) {
        return res.status(500).json({ error: 'Fallo al contactar la API', detalle: err.message });
      }

      // Esperamos un poco antes de reintentar (500ms, 1000ms, ...)
      await new Promise(r => setTimeout(r, 500 * intento));
    }
  }
}

app.listen(PORT, () => {
  console.log(`Proxy corriendo en http://localhost:${PORT}`);
});