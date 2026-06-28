from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.comment import Comment

comments_bp = Blueprint("comments", __name__)

@comments_bp.route("/<int:post_id>", methods=["GET"])
def get_comments(post_id):
    comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.fecha_creacion.asc()).all()
    result = []
    for c in comments:
        result.append({"id": c.id, "contenido": c.contenido, "fecha": c.fecha_creacion.isoformat(), "autora": {"id": c.autora.id, "nombre": c.autora.nombre, "avatar": c.autora.avatar}})
    return jsonify(result), 200

@comments_bp.route("/<int:post_id>", methods=["POST"])
@jwt_required()
def crear_comment(post_id):
    user_id = get_jwt_identity()
    data = request.get_json(silent=True)
    if not data or not data.get("contenido", "").strip():
        return jsonify({"error": "El comentario no puede estar vacío."}), 400
    comment = Comment(contenido=data["contenido"].strip(), user_id=user_id, post_id=post_id)
    db.session.add(comment)
    db.session.commit()
    return jsonify({"id": comment.id, "contenido": comment.contenido, "fecha": comment.fecha_creacion.isoformat(), "autora": {"id": comment.autora.id, "nombre": comment.autora.nombre, "avatar": comment.autora.avatar}}), 201

@comments_bp.route("/<int:comment_id>", methods=["DELETE"])
@jwt_required()
def borrar_comment(comment_id):
    user_id = get_jwt_identity()
    comment = Comment.query.get_or_404(comment_id)
    if str(comment.user_id) != str(user_id):
        return jsonify({"error": "No puedes borrar este comentario."}), 403
    db.session.delete(comment)
    db.session.commit()
    return jsonify({"mensaje": "Comentario eliminado."}), 200
