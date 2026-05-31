"""
Rutas de autenticación: registro e inicio de sesión.
La lógica con base de datos y JWT se implementará en el siguiente paso.
"""

from flask import Blueprint, jsonify, request

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Registro de nueva usuaria.
    Body esperado (futuro): nombre, email, password, pais, ciudad, etc.
    """
    # TODO: validar payload, hashear contraseña, crear User en BD, devolver JWT
    _ = request.get_json(silent=True)
    return jsonify({"message": "Registro pendiente de implementación"}), 501


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Inicio de sesión.
    Body esperado (futuro): email, password.
    """
    # TODO: verificar credenciales y devolver access_token JWT
    _ = request.get_json(silent=True)
    return jsonify({"message": "Login pendiente de implementación"}), 501
