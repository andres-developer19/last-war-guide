// server.js
// Servidor proxy local muy simple para esquivar el problema de CORS
// con la API de LWAtlas mientras trabajas en local.

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

const API_KEY = 'lwa_live_ubkzXLe4SEFkCW3Rnwfu_M-hB3p2E6yW';

app.use(cors());

// Ruta para explorar la raíz de la API (sin nada después de /api/lwatlas)
app.get('/api/lwatlas', (req, res) => explorar('', req, res));

// Cualquier petición a /api/lwatlas/algo se reenvía a la API real
app.get('/api/lwatlas/*path', (req, res) => {
  const path = req.params.path.join('/');
  explorar(path, req, res);
});

async function explorar(path, req, res) {
  // Reenviamos también los query params que venían en la petición del navegador
  // (ej: ?allianceName=SUN), porque los endpoints reales de LWAtlas los necesitan.
  const queryString = new URLSearchParams(req.query).toString();
  const targetUrl = `https://api.lwatlas.com/v1/${path}${queryString ? `?${queryString}` : ''}`;
  console.log('--- Llamando a:', targetUrl);

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'X-Api-Key': API_KEY
      }
    });

    const textoCrudo = await response.text();
    console.log('Status recibido:', response.status);
    console.log('Cuerpo recibido:', textoCrudo);

    try {
      const data = JSON.parse(textoCrudo);
      res.status(response.status).json(data);
    } catch {
      res.status(response.status).send(textoCrudo);
    }
  } catch (err) {
    console.error('Error llamando a LWAtlas:', err);
    res.status(500).json({ error: 'Fallo al contactar la API', detalle: err.message });
  }
}

app.listen(PORT, () => {
  console.log(`Proxy corriendo en http://localhost:${PORT}`);
});