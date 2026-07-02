"""
Rutas de autenticación: registro e inicio de sesión con JWT.
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash

from app.extensions import db
from app.models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Campos obligatorios en el registro
CAMPOS_REGISTRO = ("nombre", "email", "password", "pais", "ciudad")
CAMPOS_LOGIN = ("email", "password")


def _json_body():
    """Obtiene el cuerpo JSON de la petición o None si no es válido."""
    return request.get_json(silent=True)


def _validar_campos_requeridos(datos, campos):
    """
    Comprueba que todos los campos existan y no estén vacíos (tras strip).
    Devuelve (None, None) si es válido, o (mensaje, 400) si falta alguno.
    """
    if not datos or not isinstance(datos, dict):
        return "El cuerpo de la petición debe ser JSON.", 400

    for campo in campos:
        valor = datos.get(campo)
        if valor is None or (isinstance(valor, str) and not valor.strip()):
            return f"El campo '{campo}' es obligatorio.", 400

    return None, None


def _serializar_usuaria(usuaria):
    """Datos públicos de la usuaria para la respuesta (sin contraseña)."""
    return {
        "id": usuaria.id,
        "nombre": usuaria.nombre,
        "apellido": usuaria.apellido,
        "email": usuaria.email,
        "rol": usuaria.rol,
        "pais": usuaria.pais,
        "ciudad": usuaria.ciudad,
        "avatar": usuaria.avatar,
    }


def _generar_token(usuaria):
    """Crea un JWT con el id y el rol de la usuaria."""
    return create_access_token(
        identity=str(usuaria.id),
        additional_claims={"rol": usuaria.rol},
    )


@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Registro de nueva usuaria.
    Body JSON: nombre, apellido (opcional), email, password, pais, ciudad.
    """
    datos = _json_body()
    error, codigo = _validar_campos_requeridos(datos, CAMPOS_REGISTRO)
    if error:
        return jsonify({"error": error}), codigo

    nombre = datos["nombre"].strip()
    apellido_raw = datos.get("apellido")
    apellido = (
        apellido_raw.strip()
        if isinstance(apellido_raw, str) and apellido_raw.strip()
        else None
    )
    email = datos["email"].strip().lower()
    password = datos["password"]
    pais = datos["pais"].strip()
    ciudad = datos["ciudad"].strip()

    # Evita registro duplicado antes de insertar (además del unique en BD)
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Ya existe una cuenta con ese email."}), 409

    usuaria = User(
        nombre=nombre,
        apellido=apellido,
        email=email,
        password_hash=generate_password_hash(password),
        pais=pais,
        ciudad=ciudad,
        rol="usuaria",
    )

    try:
        db.session.add(usuaria)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Ya existe una cuenta con ese email."}), 409

    access_token = _generar_token(usuaria)

    return (
        jsonify(
            {
                "message": "Registro exitoso.",
                "access_token": access_token,
                "user": _serializar_usuaria(usuaria),
            }
        ),
        201,
    )


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Inicio de sesión.
    Body JSON: email, password.
    """
    datos = _json_body()
    error, codigo = _validar_campos_requeridos(datos, CAMPOS_LOGIN)
    if error:
        return jsonify({"error": error}), codigo

    email = datos["email"].strip().lower()
    password = datos["password"]

    usuaria = User.query.filter_by(email=email).first()

    # Mismo mensaje si no existe el email o la contraseña es incorrecta
    if not usuaria or not check_password_hash(usuaria.password_hash, password):
        return jsonify({"error": "Email o contraseña incorrectos."}), 401

    access_token = _generar_token(usuaria)

    return jsonify(
        {
            "message": "Inicio de sesión exitoso.",
            "access_token": access_token,
            "user": _serializar_usuaria(usuaria),
        }
    )
