"""
Importación de modelos para que SQLAlchemy los registre al cargar la app.
"""

from app.models.comment import Comment
from app.models.like import Like
from app.models.notification import Notification
from app.models.post import Post
from app.models.user import User

__all__ = ["User", "Post", "Comment", "Like", "Notification"]
