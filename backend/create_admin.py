"""
Crea o promueve a administradora una usuaria en PostgreSQL.

Ejecutar desde backend/ (con venv activado y DATABASE_URL en .env):
    set ADMIN_PASSWORD=tu_contraseña_segura
    python create_admin.py

Si la usuaria ya existe, solo actualiza rol=admin (y la contraseña si ADMIN_PASSWORD está definida).
"""

import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from werkzeug.security import generate_password_hash

# Misma resolución de imports que create_tables.py
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

ENV_PATH = BACKEND_DIR / ".env"
if not ENV_PATH.is_file():
    print(f"Error: no existe el archivo {ENV_PATH}")
    print("Copia .env.example a .env y completa DATABASE_URL.")
    sys.exit(1)

load_dotenv(ENV_PATH)

database_url = os.getenv("DATABASE_URL", "").strip()
if not database_url:
    print(f"Error: DATABASE_URL está vacía en {ENV_PATH}")
    print("Añade tu cadena de conexión PostgreSQL, por ejemplo:")
    print("  DATABASE_URL=postgresql://usuario:password@host:5432/nombre_bd")
    sys.exit(1)

# Render y otros proveedores suelen usar postgres://; SQLAlchemy requiere postgresql://
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)
    os.environ["DATABASE_URL"] = database_url

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "lorenalugosanchez3@gmail.com").strip().lower()
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "").strip()
ADMIN_NOMBRE = os.getenv("ADMIN_NOMBRE", "Lorena").strip()

from app import create_app
from app.extensions import db
from app.models.user import User

flask_app = create_app()

if not flask_app.config.get("SQLALCHEMY_DATABASE_URI"):
    print("Error: la app Flask no recibió SQLALCHEMY_DATABASE_URI. Revisa tu .env.")
    sys.exit(1)

with flask_app.app_context():
    usuaria = User.query.filter_by(email=ADMIN_EMAIL).first()

    if usuaria:
        usuaria.rol = "admin"
        if ADMIN_PASSWORD:
            usuaria.password_hash = generate_password_hash(ADMIN_PASSWORD)
        db.session.commit()
        print(f"Usuaria existente promovida a admin: {ADMIN_EMAIL} (id={usuaria.id})")
        if ADMIN_PASSWORD:
            print("Contraseña actualizada.")
        else:
            print("Contraseña sin cambios (define ADMIN_PASSWORD para cambiarla).")
        sys.exit(0)

    if not ADMIN_PASSWORD:
        print("Error: la usuaria no existe y ADMIN_PASSWORD no está definida.")
        print("Ejemplo (PowerShell):")
        print('  $env:ADMIN_PASSWORD="tu_contraseña_segura"; python create_admin.py')
        sys.exit(1)

    usuaria = User(
        nombre=ADMIN_NOMBRE,
        email=ADMIN_EMAIL,
        password_hash=generate_password_hash(ADMIN_PASSWORD),
        rol="admin",
    )
    db.session.add(usuaria)
    db.session.commit()
    print(f"Administradora creada: {ADMIN_EMAIL} (id={usuaria.id}, rol=admin)")
