# ⚔️ Last War Guide — Command Center

Última guía y panel de control para **Last War: Survival**. Frontend moderno (HTML/CSS/JS vanilla sin dependencias) + servidor Express que actúa como **proxy** a la API comunitaria de [lastwar.tools](https://api.lastwar.tools), ocultando tu API key y evitando problemas de CORS.

![Estado](https://img.shields.io/badge/proxy-lastwar.tools-gold) ![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Inicio rápido

```bash
# 1. Clona y entra
git clone https://github.com/andres-developer19/last-war-guide.git
cd last-war-guide

# 2. Instala dependencias
npm install

# 3. Configura tu API key
cp .env.example .env
#  → edita .env y pega tu LWT_API_KEY (gratis en https://api.lastwar.tools)

# 4. Arranca
npm start
```

Abre **http://localhost:3000**.

> Requiere **Node.js 18+**. No necesita build ni compilación.

## ⚙️ Configuración (`.env`)

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `LWT_API_KEY` | ✅ Sí | Tu API key de lastwar.tools |
| `LWT_SESSION_KEY` | ❌ No* | Session key para eventos/VS/warzone/acciones |
| `PORT` | ❌ No | Puerto (por defecto `3000`) |

\* Obligatoria solo para los endpoints que requieren sesión. Se obtiene con el [Capture Tool](https://github.com/LastWarTools/Capture-Tool) (próximamente desbloqueado para el protocolo actual).

## 🧭 Páginas

| Ruta | Sección | Qué hace |
|------|---------|----------|
| `/` | Inicio | Dashboard: estado del server, top alianzas, posiciones del reino, conexión API |
| `/pages/allianceSearch.html` | Alianzas | Ranking de alianzas por server, **filtro por poder mínimo** y por etiqueta |
| `/pages/alliance.html` | Roster | Miembros de una alianza, **orden por poder/nombre/rango**, buscador, online/HQ |
| `/pages/playerSearch.html` | Jugador | **Buscar la base de un jugador** por nombre en el mapa |
| `/pages/mapscan.html` | Mapa | Consultar un bloque del mapa: bases, zombies, coordenadas |
| `/pages/vs.html` | VS | Rankings, matchups, schedule y temporada de VS *(requiere sesión)* |
| `/pages/warzone.html` | Warzone | Estado y rondas de warzone *(requiere sesión)* |
| `/pages/eventos.html` | Eventos | Correo del sistema y acciones: stamina, visitantes, recompensas inactivas *(requiere sesión)* |

## 🔌 API / Proxy

El servidor expone rutas amigables que reenvían a lastwar.tools:

### Públicas (solo API key)
- `GET /api/lwt/mundo/bloque?x&y&server_id` — bloque del mapa
- `GET /api/lwt/mundo/escanear` — escáner de región
- `GET /api/lwt/mundo/buscar-jugador?name&server_id` — buscar jugador
- `GET /api/lwt/reino/posiciones/:server_id` — posiciones del reino
- `GET /api/lwt/rankings/alianzas/:server_id` — ranking de alianzas
- `GET /api/lwt/alianza/miembros/:alliance_id?sort_by=power&descending=true` — miembros ordenables
- `GET /api/lwt/pool/stats` — estado del pool

### Requieren sesión
- `GET /api/lwt/eventos/correo-sistema`, `POST /api/lwt/eventos/stamina|visitantes|recompensas-inactivas|camion-comercio`
- `GET /api/lwt/vs/*`, `GET /api/lwt/warzone/*`
- `GET /api/lwt/jugadores/detectar`

### Utilidades
- `GET /api/lwt` — catálogo completo de endpoints expuestos
- `GET /api/lwt/status` — estado de configuración
- `GET /health` — health check para plataformas de despliegue

## 📁 Estructura

```
last-war-guide/
├── server.js            # Express: sirve estáticos + proxy lastwar.tools
├── package.json
├── .env.example
├── index.html           # Dashboard
├── pages/               # Páginas HTML
├── styles/
│   ├── theme.css        # Sistema de diseño (variables, tarjetas, tablas, badges)
│   ├── nav.css          # Barra de navegación
│   └── roster.css       # Placas del roster
└── js/
    ├── navHeader.js     # Menú de navegación reutilizable
    ├── config.js        # Config global (server, alianza, API)
    ├── api.js           # Cliente fetch
    ├── utils.js         # Utilidades de formato
    └── modules/         # Lógica por página
```

## ☁️ Despliegue

Este proyecto es un servidor Node, así que se sirve con cualquier plataforma de app Node (Render, Railway, Fly.io, VPS). Configura la variable de entorno `LWT_API_KEY` en la plataforma y ejecuta `npm start`.

- **Render** (Web Service / Blueprint): `build: npm install`, `start: npm start`, env `LWT_API_KEY`.
- **Local**: `npm start`.

## 🧪 Estado actual y limitaciones

- La API de lastwar.tools usa **tokens** (50 gratis/día). Al agotarse devuelve `Insufficient tokens`.
- Los endpoints de **eventos/VS/warzone** necesitan `session_key`. La subida de credenciales aún está bloqueada por el protocolo `e408` del juego (issue #7 de lastwar.tools).
- Las funciones de **tareas secretas** y **saqueo de camiones** **no existen** en la API de lastwar.tools (son características de la herramienta de pago *LW Spy*). Este proyecto expone lo que la API sí permite.

## 📜 Licencia

MIT
