from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.routes.ai import clasificar_post
import cloudinary
import cloudinary.uploader
import os

from app.extensions import db
from app.models.post import Post
from app.models.user import User
from app.models.like import Like
from app.models.comment import Comment

posts_bp = Blueprint("posts", __name__, url_prefix="/api/posts")


def _configurar_cloudinary():
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    )

@posts_bp.route("", methods=["GET"])
@jwt_required(optional=True)
def get_posts():
    user_id = get_jwt_identity()
    posts = Post.query.order_by(Post.fecha_creacion.desc()).all()
    result = []
    for post in posts:
        likes_count = Like.query.filter_by(post_id=post.id).count()
        comments_count = Comment.query.filter_by(post_id=post.id).count()
        liked_by_me = False
        if user_id:
            liked_by_me = Like.query.filter_by(post_id=post.id, user_id=user_id).first() is not None
        result.append({
            "id": post.id,
            "texto": post.texto,
            "url": post.url,
            "fecha": post.fecha_creacion.isoformat(),
            "temas": post.temas,
            "likes_count": likes_count,
            "comments_count": comments_count,
            "liked_by_me": liked_by_me,
            "autora": {
                "id": post.autora.id,
                "nombre": post.autora.nombre,
                "avatar": post.autora.avatar,
                "profesion": post.autora.profesion,
                 "ciudad": post.autora.ciudad,      
                 "pais": post.autora.pais,    
            }
        })
    return jsonify(result), 200

@posts_bp.route("", methods=["POST"])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()

    if request.files and request.files.get("image"):
        texto = (request.form.get("texto") or "").strip()
        if not texto:
            return jsonify({"error": "El texto es obligatorio."}), 400

        _configurar_cloudinary()
        file = request.files["image"]
        upload_response = cloudinary.uploader.upload(file)
        post_url = upload_response["secure_url"]

        post = Post(
            texto=texto,
            url=post_url,
            user_id=user_id,
        )
    else:
        data = request.get_json(silent=True)

        if not data or not data.get("texto", "").strip():
            return jsonify({"error": "El texto es obligatorio."}), 400

        post = Post(
            texto=data["texto"].strip(),
            url=data.get("url"),
            user_id=user_id,
        )
        # Clasificar con IA
    try:
        post.temas = clasificar_post(post.texto)
    except Exception:
        post.temas = None

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
@posts_bp.route('/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    user_id = get_jwt_identity()
    post = Post.query.get_or_404(post_id)
    if str(post.user_id) != str(user_id):
        return jsonify({'error': 'No puedes editar este post.'}), 403
    data = request.get_json(silent=True)
    if not data or not data.get('texto', '').strip():
        return jsonify({'error': 'El texto es obligatorio.'}), 400
    post.texto = data['texto'].strip()
    db.session.commit()
    return jsonify({'message': 'Post actualizado.', 'id': post.id}), 200
