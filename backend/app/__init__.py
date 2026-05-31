"""
Factory de la aplicación Flask Bloom.
Crea la app, carga configuración y registra extensiones y blueprints.
"""

import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from app.extensions import db, jwt
from app.routes.auth import auth_bp

# Carga variables desde backend/.env (si existe)
load_dotenv()


def create_app():
    """Crea y configura la instancia de Flask."""
    app = Flask(__name__)

    # --- Configuración básica ---
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-cambiar-en-produccion")
    app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET_KEY", "dev-jwt-secret-cambiar-en-produccion"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # URI de PostgreSQL: se usará cuando DATABASE_URL esté definida en .env
    database_url = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url

    # --- Extensiones ---
    jwt.init_app(app)
    CORS(app)

    # SQLAlchemy: solo se vincula a la app si hay URL (sin conexión activa aún)
    if database_url:
        db.init_app(app)
    else:
        # Los modelos quedan definidos; la BD se conectará al configurar DATABASE_URL
        app.logger.info(
            "DATABASE_URL no configurada: modelos cargados sin conexión a PostgreSQL."
        )

    # Importar modelos para registro en el metadata de SQLAlchemy
    import app.models  # noqa: F401

    # --- Blueprints ---
    app.register_blueprint(auth_bp)

    @app.route("/api/health", methods=["GET"])
    def health():
        """Comprobación rápida de que el servidor responde."""
        return {"status": "ok", "app": "Bloom API"}

    return app
