"""
Factory de la aplicación Flask Bloom.
Crea la app, carga configuración y registra extensiones y blueprints.
"""

import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from app.extensions import db, jwt, socketio
from app.routes.ai import ai_bp
from app.routes.auth import auth_bp
from app.routes.posts import posts_bp
from app.routes.users import users_bp
from app.routes.likes import likes_bp
from app.routes.comments import comments_bp

BACKEND_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BACKEND_DIR / ".env")


def create_app():
    """Crea y configura la instancia de Flask."""
    flask_app = Flask(__name__)

    flask_app.config["SECRET_KEY"] = os.getenv(
        "SECRET_KEY", "dev-secret-cambiar-en-produccion"
    )
    flask_app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET_KEY", "dev-jwt-secret-cambiar-en-produccion"
    )
    flask_app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
        seconds=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 86400))
    )
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    database_url = os.getenv("DATABASE_URL")
    if database_url and database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = database_url

    jwt.init_app(flask_app)
    CORS(flask_app)
    socketio.init_app(flask_app, cors_allowed_origins="*")

    if database_url:
        db.init_app(flask_app)
    else:
        flask_app.logger.warning(
            "DATABASE_URL no configurada: API sin base de datos. "
            "Completa backend/.env para usar PostgreSQL."
        )

    from . import models  # noqa: F401

    flask_app.register_blueprint(auth_bp)
    flask_app.register_blueprint(posts_bp)
    flask_app.register_blueprint(users_bp)
    flask_app.register_blueprint(ai_bp)
    flask_app.register_blueprint(likes_bp, url_prefix="/api/likes")
    flask_app.register_blueprint(comments_bp, url_prefix="/api/comments")

    @flask_app.route("/api/health", methods=["GET"])
    def health():
        return {"status": "ok", "app": "Bloom API"}

    from app import sockets  # noqa: F401

    return flask_app