# Bloom

[![Demo](https://img.shields.io/badge/demo-en_vivo-FF5A9D?style=for-the-badge)](https://bloom-app-pied-eight.vercel.app)
[![Frontend](https://img.shields.io/badge/frontend-React_19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Backend](https://img.shields.io/badge/backend-Flask_3-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Database](https://img.shields.io/badge/database-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Deploy](https://img.shields.io/badge/deploy-Vercel_+_Render-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

> Plataforma comunitaria para mujeres que se reinventan profesionalmente.

**Demo en producción:** [https://bloom-app-pied-eight.vercel.app](https://bloom-app-pied-eight.vercel.app)

---

## Descripción

Bloom es una red social tipo feed donde mujeres en proceso de cambio de carrera comparten historias, se apoyan con comentarios y likes, y encuentran inspiración en una comunidad segura.

La aplicación está construida como un proyecto **full stack** desacoplado: un frontend en React consume una API REST en Flask, con autenticación JWT, persistencia en PostgreSQL, imágenes en Cloudinary, funciones de IA con Groq y notificaciones en tiempo real mediante WebSockets.

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 · Vite · Tailwind CSS · React Router · Context API |
| Backend | Python · Flask · SQLAlchemy · Flask-JWT-Extended |
| Base de datos | PostgreSQL |
| Autenticación | JWT (roles: `usuaria` · `admin`) |
| Imágenes | Cloudinary |
| Inteligencia artificial | Groq (Llama 3.3) |
| Tiempo real | Flask-SocketIO · Socket.IO Client |
| Deploy | Vercel (frontend) · Render (backend + PostgreSQL) |

---

## Funcionalidades principales

### Para usuarias

- Registro e inicio de sesión con JWT
- Perfil personal con foto, historia, profesión, país y ciudad
- Feed de publicaciones con texto e imágenes
- Likes y comentarios (crear, editar y borrar)
- Filtros por país, ciudad y temática
- Perfil público de otras usuarias
- Sugerencias de IA para mejorar publicaciones
- Preguntas inspiradoras y resumen semanal generados por IA
- Notificaciones en tiempo real al recibir comentarios

### Para administradoras

- Moderación de posts y comentarios ajenos
- Badge visual de rol admin en el feed

---

## Arquitectura del proyecto

```
bloom-app/
├── backend/                    # API Flask
│   ├── app/
│   │   ├── __init__.py         # Factory de la aplicación
│   │   ├── extensions.py       # db, jwt, socketio
│   │   ├── auth_utils.py       # Utilidades de autorización
│   │   ├── sockets.py          # Eventos WebSocket
│   │   ├── models/             # Modelos SQLAlchemy
│   │   └── routes/             # Blueprints (auth, posts, users, likes, comments, ai)
│   ├── run.py                  # Punto de entrada del servidor
│   ├── create_tables.py        # Creación de tablas en PostgreSQL
│   ├── create_admin.py         # Script para crear/promover admin
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                   # SPA React
│   ├── src/
│   │   ├── pages/              # Landing, Login, Register, Feed, Profile...
│   │   ├── components/         # Avatar, CommentList, UserMenu...
│   │   ├── context/            # UserContext (estado global)
│   │   ├── config/             # URL del API
│   │   ├── utils/              # Helpers (validación, fechas)
│   │   ├── theme/              # Colores del design system
│   │   ├── App.jsx             # Rutas
│   │   └── main.jsx            # Punto de entrada
│   ├── vercel.json             # Rewrites SPA
│   └── package.json
│
└── docs/                       # Documentación de producto y diseño
```

### Flujo de datos

```
React (Vercel)  ──HTTP/JSON──►  Flask API (Render)  ──►  PostgreSQL
       │                              │
       │                              ├──► Cloudinary (imágenes)
       │                              └──► Groq (IA)
       └── WebSocket ◄────────────────► Flask-SocketIO (notificaciones)
```

---

## Cómo correrlo en local

### Requisitos previos

- Python 3.11+
- Node.js 18+
- PostgreSQL (local o remoto)
- Cuentas en Cloudinary y Groq (opcional, para imágenes e IA)

### 1. Backend

```bash
# Clonar el repositorio
git clone https://github.com/lital-lorena/bloom-app.git
cd bloom-app/backend

# Crear entorno virtual e instalar dependencias
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux
pip install -r requirements.txt

# Configurar variables de entorno
copy .env.example .env       # Windows
# cp .env.example .env       # macOS / Linux
# Edita .env con tus valores

# Crear tablas en la base de datos
python create_tables.py

# Arrancar el servidor
python run.py
```

El backend quedará disponible en **http://127.0.0.1:5000**.

Comprueba que responde:

```bash
curl http://127.0.0.1:5000/api/health
```

### 2. Frontend

En otra terminal:

```bash
cd bloom-app/frontend

# Instalar dependencias
npm install

# Configurar URL del backend (opcional si usas el valor por defecto)
# Crea frontend/.env con:
# VITE_API_URL=http://127.0.0.1:5000

# Arrancar en modo desarrollo
npm run dev
```

Abre la URL que muestra Vite (normalmente **http://localhost:5173**).

---

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Cadena de conexión PostgreSQL |
| `SECRET_KEY` | Clave secreta de Flask |
| `JWT_SECRET_KEY` | Clave para firmar tokens JWT |
| `JWT_ACCESS_TOKEN_EXPIRES` | Expiración del token en segundos (opcional) |
| `CLOUDINARY_CLOUD_NAME` | Nombre del cloud en Cloudinary |
| `CLOUDINARY_API_KEY` | API key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary |
| `GROQ_API_KEY` | API key de Groq para funciones de IA |
| `FLASK_ENV` | Entorno Flask (opcional) |

Variables opcionales para `create_admin.py`:

| Variable | Descripción |
|----------|-------------|
| `ADMIN_EMAIL` | Email de la cuenta administradora |
| `ADMIN_PASSWORD` | Contraseña de la cuenta admin |
| `ADMIN_NOMBRE` | Nombre de la administradora |

### Frontend (`frontend/.env`)

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base del backend (sin barra final) |

---

## Endpoints principales de la API

Base URL local: `http://127.0.0.1:5000`

Las rutas protegidas requieren el header `Authorization: Bearer <token>`.

### Salud

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/api/health` | No | Comprueba que la API está activa |

### Autenticación

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | No | Registro de nueva usuaria |
| `POST` | `/api/auth/login` | No | Inicio de sesión |

### Posts

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/api/posts` | Opcional | Lista el feed con likes y comentarios |
| `POST` | `/api/posts` | Sí | Crea un post (JSON o FormData con imagen) |
| `PUT` | `/api/posts/:id` | Sí | Edita un post propio |
| `DELETE` | `/api/posts/:id` | Sí | Elimina un post (autora o admin) |

### Usuarias

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/api/users/me` | Sí | Perfil de la usuaria logueada |
| `PUT` | `/api/users/me` | Sí | Actualiza perfil y avatar |
| `GET` | `/api/users/:id` | No | Perfil público y posts de una usuaria |

### Likes

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/likes/:postId` | Sí | Da like a un post |
| `DELETE` | `/api/likes/:postId` | Sí | Quita el like |

### Comentarios

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/api/comments/:postId` | No | Lista comentarios de un post |
| `POST` | `/api/comments/:postId` | Sí | Crea un comentario |
| `PUT` | `/api/comments/item/:id` | Sí | Edita un comentario propio |
| `DELETE` | `/api/comments/item/:id` | Sí | Elimina un comentario (autora o admin) |

### Inteligencia artificial

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/ai/suggest` | Sí | Mejora el borrador de un post |
| `GET` | `/api/ai/inspiracion` | Sí | Genera una pregunta inspiradora |
| `GET` | `/api/ai/resumen` | No | Resumen semanal de la comunidad |

### WebSocket (Socket.IO)

| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `conectar_usuaria` | Cliente → servidor | Une a la usuaria a su sala personal |
| `nueva_notificacion` | Servidor → cliente | Avisa de un nuevo comentario relevante |

---

## URLs de producción

| Servicio | URL |
|----------|-----|
| **Frontend (Vercel)** | [https://bloom-app-pied-eight.vercel.app](https://bloom-app-pied-eight.vercel.app) |
| **Backend API (Render)** | [https://bloom-app-70t5.onrender.com](https://bloom-app-70t5.onrender.com) |

> **Nota:** El backend en Render (plan gratuito) puede tardar unos segundos en despertar tras inactividad. Comprueba su estado en [https://bloom-app-70t5.onrender.com/api/health](https://bloom-app-70t5.onrender.com/api/health).

---

## Autora

**Lorena Lugo** — Full Stack Developer en formación

GitHub: [github.com/lital-lorena](https://github.com/lital-lorena)

---

## Licencia

Proyecto académico / portfolio. Todos los derechos reservados.
