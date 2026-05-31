"""
Modelo Comment: comentarios en publicaciones.
"""

from datetime import datetime, timezone

from app.extensions import db


def _utc_now():
    """Fecha y hora actual en UTC para campos por defecto."""
    return datetime.now(timezone.utc)


class Comment(db.Model):
    """Comentario de una usuaria en un post."""

    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    contenido = db.Column(db.Text, nullable=False)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    post_id = db.Column(
        db.Integer,
        db.ForeignKey("posts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    fecha_creacion = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=_utc_now,
    )

    autora = db.relationship("User", back_populates="comments")
    post = db.relationship("Post", back_populates="comments")

    def __repr__(self):
        return f"<Comment {self.id} post_id={self.post_id}>"
