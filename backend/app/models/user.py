"""
Modelo User: usuarias y administradoras de Bloom.
"""

from datetime import datetime, timezone

from app.extensions import db


def _utc_now():
    """Fecha y hora actual en UTC para campos por defecto."""
    return datetime.now(timezone.utc)


class User(db.Model):
    """Usuaria de la plataforma (rol usuaria o admin)."""

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    # Valores esperados: 'usuaria' | 'admin'
    rol = db.Column(db.String(20), nullable=False, default="usuaria")
    avatar = db.Column(db.String(500), nullable=True)  # URL de imagen (p. ej. Cloudinary)
    mi_historia = db.Column(db.Text, nullable=True)
    pais = db.Column(db.String(100), nullable=True)
    ciudad = db.Column(db.String(100), nullable=True)
    fecha_registro = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=_utc_now,
    )

    # Relaciones con otras entidades
    posts = db.relationship("Post", back_populates="autora", lazy="dynamic")
    comments = db.relationship("Comment", back_populates="autora", lazy="dynamic")
    likes = db.relationship("Like", back_populates="usuaria", lazy="dynamic")
    notifications = db.relationship(
        "Notification", back_populates="destinataria", lazy="dynamic"
    )

    def __repr__(self):
        return f"<User {self.id} {self.email}>"
