"""
Modelo Notification: avisos en tiempo real para usuarias.
"""

from datetime import datetime, timezone

from app.extensions import db


def _utc_now():
    """Fecha y hora actual en UTC para campos por defecto."""
    return datetime.now(timezone.utc)


class Notification(db.Model):
    """Notificación asociada a una usuaria y opcionalmente a un post."""

    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    post_id = db.Column(
        db.Integer,
        db.ForeignKey("posts.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    # Ejemplos: 'like', 'comment', 'mention'
    tipo = db.Column(db.String(50), nullable=False)
    leida = db.Column(db.Boolean, nullable=False, default=False)
    fecha_creacion = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=_utc_now,
    )

    destinataria = db.relationship("User", back_populates="notifications")
    post = db.relationship("Post", back_populates="notifications")

    def __repr__(self):
        return f"<Notification {self.id} tipo={self.tipo} user_id={self.user_id}>"
