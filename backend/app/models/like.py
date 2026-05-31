"""
Modelo Like: valoraciones en publicaciones.
"""

from app.extensions import db


class Like(db.Model):
    """Like de una usuaria en un post (una vez por usuaria y post)."""

    __tablename__ = "likes"

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
        nullable=False,
        index=True,
    )

    usuaria = db.relationship("User", back_populates="likes")
    post = db.relationship("Post", back_populates="likes")

    # Evita likes duplicados de la misma usuaria en el mismo post
    __table_args__ = (
        db.UniqueConstraint("user_id", "post_id", name="uq_like_user_post"),
    )

    def __repr__(self):
        return f"<Like {self.id} user_id={self.user_id} post_id={self.post_id}>"
