from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
from app.models.post import Post
from app.models.user import User

posts_bp = Blueprint("posts", __name__, url_prefix="/api/posts")

@posts_bp.route("", methods=["GET"])
def get_posts():
    posts = Post.query.order_by(Post.fecha_creacion.desc()).all()
    result = []
    for post in posts:
        result.append({
            "id": post.id,
            "texto": post.texto,
            "url": post.url,
            "fecha": post.fecha_creacion.isoformat(),
            "autora": {
                "id": post.autora.id,
                "nombre": post.autora.nombre,
                "avatar": post.autora.avatar,
            }
        })
    return jsonify(result), 200

@posts_bp.route("", methods=["POST"])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    data = request.get_json(silent=True)

    if not data or not data.get("texto", "").strip():
        return jsonify({"error": "El texto es obligatorio."}), 400

    post = Post(
        texto=data["texto"].strip(),
        url=data.get("url"),
        user_id=user_id,
    )
    db.session.add(post)
    db.session.commit()

    return jsonify({"message": "Post creado.", "id": post.id}), 201

@posts_bp.route("/<int:post_id>", methods=["DELETE"])
@jwt_required()
def delete_post(post_id):
    user_id = get_jwt_identity()
    post = Post.query.get_or_404(post_id)

    if str(post.user_id) != str(user_id):
        return jsonify({"error": "No puedes borrar este post."}), 403

    db.session.delete(post)
    db.session.commit()

    return jsonify({"message": "Post eliminado."}), 200