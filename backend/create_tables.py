"""
Crea las tablas en PostgreSQL según los modelos SQLAlchemy.

Ejecutar desde backend/ (con venv activado y DATABASE_URL en .env):
    python create_tables.py
"""

import os
import sys
from pathlib import Path

from dotenv import load_dotenv

# Misma resolución de imports que run.py
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

from app import create_app
from app.extensions import db

flask_app = create_app()

if not flask_app.config.get("SQLALCHEMY_DATABASE_URI"):
    print("Error: la app Flask no recibió SQLALCHEMY_DATABASE_URI. Revisa tu .env.")
    sys.exit(1)

with flask_app.app_context():
    from app import models  # noqa: F401

    db.create_all()
    tablas = sorted(db.metadata.tables.keys())
    print("Tablas creadas correctamente en PostgreSQL:")
    for nombre in tablas:
        print(f"  - {nombre}")
