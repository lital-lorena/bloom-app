# Diagrama de Base de Datos — Bloom 🌸

## Relaciones

- User tiene muchos Posts
- User tiene muchos Comments
- User tiene muchos Likes
- User tiene muchas Notifications
- Post tiene muchos Comments
- Post tiene muchos Likes
- Post tiene muchas Notifications

## Diagrama

```mermaid

erDiagram

    users {

        int id PK

        string nombre

        string email

        string password_hash

        string rol

        string avatar

        text mi_historia

        string pais

        string ciudad

        datetime fecha_registro

    }

    posts {

        int id PK

        text texto

        string url

        int user_id FK

        datetime fecha_creacion

    }

    comments {

        int id PK

        text contenido

        int user_id FK

        int post_id FK

        datetime fecha_creacion

    }

    likes {

        int id PK

        int user_id FK

        int post_id FK

    }

    notifications {

        int id PK

        int user_id FK

        int post_id FK

        string tipo

        boolean leida

        datetime fecha_creacion

    }

    users ||--o{ posts : "escribe"

    users ||--o{ comments : "comenta"

    users ||--o{ likes : "da"

    users ||--o{ notifications : "recibe"

    posts ||--o{ comments : "tiene"

    posts ||--o{ likes : "tiene"

    posts ||--o{ notifications : "genera"

```



