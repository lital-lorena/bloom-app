# Bloom — Descripción técnica del proyecto

## Objetivo técnico del proyecto

Construir una aplicación web full stack que implemente la plataforma Bloom descrita en [`product-description.md`](product-description.md): feed de publicaciones, perfiles de usuaria, interacciones (likes y comentarios), filtros por país, ciudad y temática, recursos votados por la comunidad, notificaciones en tiempo real y panel de administración con moderación y gestión de usuarias.

El objetivo técnico concreto es entregar un sistema **desacoplado en cliente y servidor**, con API REST autenticada, persistencia relacional, subida de imágenes delegada a un servicio externo, comunicación en tiempo real vía WebSockets y despliegue en entornos gestionados (Render y Vercel), manteniendo el código versionado y el avance planificado en sprints semanales.

## Arquitectura de la aplicación

Bloom sigue una arquitectura **cliente-servidor** en tres capas principales:

```
┌─────────────────────────────────────────────────────────────┐
│  Cliente (Vercel)                                           │
│  React + Context API + Tailwind CSS                         │
│  · UI: feed, perfiles, formularios, filtros, notificaciones │
│  · Estado global y llamadas HTTP al API                     │
│  · Conexión WebSocket para eventos en tiempo real           │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / WSS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Servidor (Render)                                          │
│  Flask + SQLAlchemy                                         │
│  · API REST (recursos, usuarias, posts, likes, comentarios) │
│  · Autenticación JWT y autorización por rol                 │
│  · WebSockets (notificaciones y eventos en vivo)            │
└──────────────┬────────────────────────────┬───────────────────┘
               │                            │
               ▼                            ▼
┌──────────────────────────┐   ┌──────────────────────────────┐
│  PostgreSQL              │   │  Cloudinary                  │
│  Datos relacionales      │   │  Almacenamiento de imágenes  │
│  (usuarias, posts, etc.) │   │  (fotos de perfil y posts)   │
└──────────────────────────┘   └──────────────────────────────┘
```

**Flujo principal**

1. La usuaria interactúa con la SPA en React; el estado compartido se gestiona con Context API.
2. Las operaciones CRUD y de autenticación se resuelven contra la API Flask; el token JWT identifica la sesión y el rol (`usuaria` o `admin`).
3. SQLAlchemy persiste entidades en PostgreSQL (usuarias, posts, comentarios, likes, recursos, etc.).
4. Las imágenes se suben o referencian vía Cloudinary; en base de datos se guardan URLs o identificadores, no archivos binarios.
5. Los eventos que requieren respuesta inmediata (p. ej. notificaciones) se propagan por WebSocket desde el backend al cliente conectado.

**Separación de responsabilidades**

| Componente | Responsabilidad |
|------------|-----------------|
| Frontend | Presentación, validación de formularios en cliente, enrutamiento, estado de UI |
| Backend | Reglas de negocio, autorización, acceso a datos, integración Cloudinary y WebSockets |
| PostgreSQL | Fuente única de verdad para datos estructurados |
| Cloudinary | Hosting y transformación de imágenes |
| GitHub | Repositorio, historial y seguimiento en GitHub Projects |

## Stack tecnológico justificado

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| Backend | Python + Flask + SQLAlchemy | Stack ágil para APIs REST, curva de aprendizaje contenida y ORM que facilita modelado y migraciones sobre PostgreSQL. |
| Base de datos | PostgreSQL | Relacional, robusta para relaciones entre usuarias, posts, comentarios y votos; adecuada para filtros y consultas estructuradas. |
| Autenticación | JWT (roles: usuaria, admin) | Autenticación stateless en API; el rol en el token permite proteger rutas de moderación y gestión sin sesiones en servidor. |
| Frontend | React + Context API + Tailwind CSS | Componentes reutilizables para el feed y formularios; Context API evita dependencias extra de estado global en un proyecto individual; Tailwind acelera UI consistente. |
| Imágenes | Cloudinary | Evita almacenar y servir binarios desde el backend; ofrece CDN y optimización de imágenes para perfiles y posts. |
| Tiempo real | WebSockets | Canal bidireccional para notificaciones sin polling constante; encaja con likes, comentarios y avisos en vivo. |
| Deploy | Render (backend) + Vercel (frontend) | Render hospeda Flask y PostgreSQL de forma sencilla; Vercel despliega la SPA React con CI integrado y buen rendimiento estático. |
| Control de versiones | GitHub | Repositorio central, ramas, revisiones y colaboración futura. |
| Gestión del proyecto | GitHub Projects | Tablero kanban alineado con el repo: issues, sprints y entregas en un solo ecosistema. |

## Metodología de trabajo

El proyecto lo desarrolla **una sola persona** (full stack). La metodología combina:

- **Desarrollo iterativo por sprints**: entregas incrementales cada semana, con un hito visible los jueves.
- **GitHub como eje operativo**: código en repositorio, tareas e hitos en GitHub Projects, y cierre de sprint asociado a merge o tag según convenga.
- **Priorización por valor de producto**: cada sprint prioriza funcionalidades que desbloquean la experiencia de usuaria o las capacidades de admin, antes que optimizaciones prematuras.
- **Documentación ligera en repo**: `product-description.md` define el qué; este documento define el cómo técnico; el README resume el proyecto para visitantes del repositorio.

Dado el tamaño del equipo, no hay ceremonias formales de Scrum; sí hay **planificación semanal**, **definición de hecho** por entrega (funciona en local o en entorno desplegado) y **retrospectiva breve** al cerrar cada jueves para ajustar el siguiente sprint.

## Sprints y entregas

Calendario: **6 sprints semanales**, con **entrega cada jueves**. La distribución propuesta alinea dependencias técnicas (auth antes del feed, API antes de WebSockets, etc.):

| Sprint | Semana | Entrega (jueves) | Objetivo |
|--------|--------|------------------|----------|
| 1 | Semana 1 | Jueves 1 | Fundamentos: repositorio, estructura backend/frontend, PostgreSQL, modelos base, registro/login JWT, despliegue inicial (esqueleto en Render + Vercel). |
| 2 | Semana 2 | Jueves 2 | Perfiles de usuaria: edición de perfil, integración Cloudinary para foto, API y pantallas protegidas. |
| 3 | Semana 3 | Jueves 3 | Feed y posts: crear y listar posts (texto, foto, enlace), feed principal en React. |
| 4 | Semana 4 | Jueves 4 | Interacción social: likes, comentarios, filtros por país, ciudad y temática. |
| 5 | Semana 5 | Jueves 5 | Tiempo real y recursos: WebSockets para notificaciones; recursos votados por la comunidad. |
| 6 | Semana 6 | Jueves 6 | Admin y cierre: rol admin (moderación de contenido, gestión de usuarias), pruebas integradas, ajustes de deploy y documentación de despliegue. |

Cada entrega del jueves debe ser **demostrable** (entorno local o URLs de staging/producción) y registrada en GitHub Projects como columna o milestone completado.

## Riesgos técnicos identificados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| **Carga en una sola desarrolladora** | Retrasos en sprints o alcance incompleto | Alcance mínimo viable por sprint; priorizar auth + feed antes que extras; usar GitHub Projects para limitar trabajo en curso. |
| **WebSockets en Render** | Conexiones inestables o límites del plan gratuito | Probar WSS en staging pronto; fallback a polling corto si el proveedor limita conexiones persistentes; documentar variables de entorno y URLs. |
| **JWT y roles** | Acceso no autorizado a rutas de admin | Validar rol en cada endpoint sensible; no confiar solo en el frontend; tokens con expiración y refresh acordado. |
| **CORS y entornos (local / Vercel / Render)** | Frontend no puede llamar al API | Configurar CORS explícitamente en Flask; variables `VITE_*` / `REACT_APP_*` por entorno; checklist en cada deploy. |
| **Subida de imágenes (Cloudinary)** | Cuotas, errores de formato o URLs rotas | Validar tipo y tamaño en backend; manejo de errores en UI; no persistir binarios en PostgreSQL. |
| **Migraciones de esquema (SQLAlchemy)** | Pérdida de datos o desincronización local/prod | Migraciones versionadas (Flask-Migrate o equivalente); backup antes de cambios en producción. |
| **Seguridad de contenido generado por usuarias** | XSS o enlaces maliciosos en posts | Sanitizar o escapar salida en frontend; moderación admin; validación de URLs en recursos. |
| **Complejidad full stack para una persona** | Deuda técnica o pruebas insuficientes | Tests manuales por sprint; tests automatizados en endpoints críticos (auth, permisos) cuando el tiempo lo permita. |

---

Este documento complementa la descripción de producto en [`product-description.md`](product-description.md) y el resumen del repositorio en [`README.md`](../README.md).
