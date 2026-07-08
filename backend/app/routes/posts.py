from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import func
from app.routes.ai import clasificar_post
import cloudinary
import cloudinary.uploader
import os

from app.auth_utils import es_admin
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
    # Antes se hacían hasta 3 consultas por post (likes, comentarios, liked_by_me).
    # Ahora se precalculan con 3 consultas agregadas y el bucle solo lee diccionarios/set.
    user_id = get_jwt_identity()
    posts = Post.query.order_by(Post.fecha_creacion.desc()).all()

    likes_por_post = {
        post_id: count
        for post_id, count in db.session.query(Like.post_id, func.count())
        .group_by(Like.post_id)
        .all()
    }

    comments_por_post = {
        post_id: count
        for post_id, count in db.session.query(Comment.post_id, func.count())
        .group_by(Comment.post_id)
        .all()
    }

    likes_de_usuaria = set()
    if user_id:
        likes_de_usuaria = {
            post_id
            for (post_id,) in db.session.query(Like.post_id)
            .filter_by(user_id=user_id)
            .all()
        }

    result = []
    for post in posts:
        result.append({
            "id": post.id,
            "texto": post.texto,
            "url": post.url,
            "fecha": post.fecha_creacion.isoformat(),
            "temas": post.temas,
            "likes_count": likes_por_post.get(post.id, 0),
            "comments_count": comments_por_post.get(post.id, 0),
            "liked_by_me": post.id in likes_de_usuaria,
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

    if str(post.user_id) != str(user_id) and not es_admin(user_id):
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
