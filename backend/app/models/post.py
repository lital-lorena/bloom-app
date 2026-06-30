"""
Modelo Post: publicaciones del feed.
"""

from datetime import datetime, timezone

from app.extensions import db


def _utc_now():
    """Fecha y hora actual en UTC para campos por defecto."""
    return datetime.now(timezone.utc)


class Post(db.Model):
    """Publicación en el feed (texto y enlace opcional)."""

    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    texto = db.Column(db.Text, nullable=False)
    url = db.Column(db.String(500), nullable=True)
    temas = db.Column(db.String(300), nullable=True)  # Temas asignados por IA, separados por coma
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    fecha_creacion = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=_utc_now,
    )

    autora = db.relationship("User", back_populates="posts")
    comments = db.relationship(
        "Comment", back_populates="post", lazy="dynamic", cascade="all, delete-orphan"
    )
    likes = db.relationship(
        "Like", back_populates="post", lazy="dynamic", cascade="all, delete-orphan"
    )
    notifications = db.relationship(
        "Notification", back_populates="post", lazy="dynamic", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Post {self.id} user_id={self.user_id}>"
