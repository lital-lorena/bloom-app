"""
Extensiones compartidas de la aplicación Flask.
Se inicializan en create_app() para evitar importaciones circulares.
"""

from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy

# Instancia de SQLAlchemy (modelos y consultas)
db = SQLAlchemy()

# Gestor de tokens JWT (login y rutas protegidas)
jwt = JWTManager()
