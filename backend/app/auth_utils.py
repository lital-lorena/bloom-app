"""Utilidades de autorización."""

from app.extensions import db
from app.models.user import User


def es_admin(user_id):
    """True si la usuaria tiene rol admin (consulta BD, fuente de verdad)."""
    if user_id is None:
        return False
    usuaria = db.session.get(User, int(user_id))
    return usuaria is not None and usuaria.rol == "admin"
