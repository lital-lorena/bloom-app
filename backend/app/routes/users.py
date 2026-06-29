from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
import cloudinary
import cloudinary.uploader
import os


users_bp = Blueprint('users', __name__, url_prefix='/api')

@users_bp.route('/users/me', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "Usuaria no encontrada"}), 404

    data = request.form if request.form else request.get_json() or {}

    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET")
    )

    if "nombre" in data:
        user.nombre = data["nombre"]
    if "apellido" in data:
        user.apellido = data["apellido"]
    if "mi_historia" in data:
        user.mi_historia = data["mi_historia"]
    if "pais" in data:
        user.pais = data["pais"]
    if "ciudad" in data:
        user.ciudad = data["ciudad"]
    if "profesion" in data:
        user.profesion = data["profesion"]

    if 'avatar' in request.files:
        file = request.files['avatar']
        response = cloudinary.uploader.upload(file)
        user.avatar = response['secure_url']
    db.session.commit()

    return jsonify({
        "message": "Perfil actualizado",
        "user": {
            "id": user.id,
            "nombre": user.nombre,
            "apellido": user.apellido,
            "mi_historia": user.mi_historia,
            "pais": user.pais,
            "ciudad": user.ciudad,
            "avatar": user.avatar,
            "profesion": user.profesion
        }
    }), 200


@users_bp.route('/users/me', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "Usuaria no encontrada"}), 404

    return jsonify({
        "id": user.id,
        "nombre": user.nombre,
        "apellido": user.apellido,
        "mi_historia": user.mi_historia,
        "pais": user.pais,
        "ciudad": user.ciudad,
        "avatar": user.avatar,
        "profesion": user.profesion,
        "rol": user.rol,
    }), 200


@users_bp.route('/users/<int:user_id>', methods=['GET'])
def get_public_profile(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "Usuaria no encontrada"}), 404

    posts = []
    for post in user.posts.order_by(Post.fecha_creacion.desc()).all():
        comments_count = Comment.query.filter_by(post_id=post.id).count()
        posts.append({
            "id": post.id,
            "texto": post.texto,
            "url": post.url,
            "fecha": post.fecha_creacion.isoformat(),
            "comments_count": comments_count,
        })

    return jsonify({
        "id": user.id,
        "nombre": user.nombre,
        "apellido": user.apellido,
        "mi_historia": user.mi_historia,
        "pais": user.pais,
        "ciudad": user.ciudad,
        "avatar": user.avatar,
        "profesion": user.profesion,
        "posts": posts
    }), 200