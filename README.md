#  Bloom

> A community platform for women reinventing their careers.

## ¿Qué es Bloom?

Bloom es una plataforma tipo feed donde mujeres que se reinventan 

profesionalmente comparten posts, se apoyan con comentarios y likes, 

y encuentran recursos útiles votados por la comunidad.

## ¿Para quién?

Mujeres en proceso de cambio de carrera, sin límite de sector.

## ¿Qué puede hacer una usuaria?

- Registrarse y hacer login

- Ver y editar su perfil con foto

- Crear posts con texto, foto y link

- Ver el feed de todas las usuarias

- Dar likes y comentar posts

- Filtrar por país, ciudad o temática

- Recibir notificaciones en tiempo real

## ¿Qué puede hacer el admin?

- Moderar y eliminar contenido inapropiado

- Gestionar usuarias

## Stack tecnológico

| Capa | Tecnología |

|---|---|

| Backend | Python + Flask + SQLAlchemy |

| Autenticación | JWT |

| Frontend | React + Context API |

| Imágenes | Cloudinary |

| Tiempo real | WebSockets |

| Deploy | Render + Vercel |

## Autora

Lorena — Full Stack Developer en formación  

GitHub: [@lital-lorena]([https://github.com/lital-lorena](https://github.com/lital-lorena))

## API Endpoints

Base URL local: `http://localhost:5000`

Todas las rutas que reciben datos esperan cuerpo **JSON** (`Content-Type: application/json`).

---

### Comprobar estado del servidor

| | |
|---|---|
| **Método** | `GET` |
| **URL** | `/api/health` |
| **Descripción** | Verifica que la API está en ejecución. No requiere autenticación. |
| **Body** | No aplica |

**Ejemplo de respuesta** `200 OK`:

```json
{
  "status": "ok",
  "app": "Bloom API"
}
```

---

### Registro de usuaria

| | |
|---|---|
| **Método** | `POST` |
| **URL** | `/api/auth/register` |
| **Descripción** | Crea una cuenta nueva, guarda la contraseña hasheada en PostgreSQL y devuelve un token JWT. |
| **Body** | `nombre`, `email`, `password`, `pais`, `ciudad` (todos obligatorios) |

**Body de ejemplo:**

```json
{
  "nombre": "Ana García",
  "email": "ana@ejemplo.com",
  "password": "miClaveSegura123",
  "pais": "España",
  "ciudad": "Madrid"
}
```

**Ejemplo de respuesta** `201 Created`:

```json
{
  "message": "Registro exitoso.",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Ana García",
    "email": "ana@ejemplo.com",
    "rol": "usuaria",
    "pais": "España",
    "ciudad": "Madrid"
  }
}
```

**Errores frecuentes:**

| Código | Motivo |
|--------|--------|
| `400` | Falta algún campo o el body no es JSON válido |
| `409` | El email ya está registrado |

---

### Inicio de sesión

| | |
|---|---|
| **Método** | `POST` |
| **URL** | `/api/auth/login` |
| **Descripción** | Valida email y contraseña y devuelve un token JWT si las credenciales son correctas. |
| **Body** | `email`, `password` (ambos obligatorios) |

**Body de ejemplo:**

```json
{
  "email": "ana@ejemplo.com",
  "password": "miClaveSegura123"
}
```

**Ejemplo de respuesta** `200 OK`:

```json
{
  "message": "Inicio de sesión exitoso.",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Ana García",
    "email": "ana@ejemplo.com",
    "rol": "usuaria",
    "pais": "España",
    "ciudad": "Madrid"
  }
}
```

**Errores frecuentes:**

| Código | Motivo |
|--------|--------|
| `400` | Falta `email` o `password` |
| `401` | Email o contraseña incorrectos |

