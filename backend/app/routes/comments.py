from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db, socketio
from app.models.comment import Comment
from app.models.post import Post

comments_bp = Blueprint("comments", __name__)


@comments_bp.route("/<int:post_id>", methods=["GET"])
def get_comments(post_id):
    comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.fecha_creacion.asc()).all()
    result = []
    for c in comments:
        result.append({
            "id": c.id,
            "contenido": c.contenido,
            "fecha": c.fecha_creacion.isoformat(),
            "autora": {
                "id": c.autora.id,
                "nombre": c.autora.nombre,
                "avatar": c.autora.avatar,
            }
        })
    return jsonify(result), 200


@comments_bp.route("/<int:post_id>", methods=["POST"])
@jwt_required()
def crear_comment(post_id):
    user_id = get_jwt_identity()
    data = request.get_json(silent=True)

    if not data or not data.get("contenido", "").strip():
        return jsonify({"error": "El comentario no puede estar vacio."}), 400

    comment = Comment(
        contenido=data["contenido"].strip(),
        user_id=user_id,
        post_id=post_id,
    )
    db.session.add(comment)
    db.session.commit()

    post = Post.query.get(post_id)
    usuarias_a_notificar = set()

    if post and str(post.user_id) != str(user_id):
        usuarias_a_notificar.add(str(post.user_id))

    comentaristas_previas = db.session.query(Comment.user_id).filter(
        Comment.post_id == post_id,
        Comment.id != comment.id
    ).distinct().all()

    for (uid,) in comentaristas_previas:
        if str(uid) != str(user_id):
            usuarias_a_notificar.add(str(uid))

    for uid in usuarias_a_notificar:
        socketio.emit(
            "nueva_notificacion",
            {
                "mensaje": f"{comment.autora.nombre} comentó en un post donde participaste",
                "post_id": post_id,
            },
            room=f"user_{uid}",
            namespace="/"
        )

    return jsonify({
        "id": comment.id,
        "contenido": comment.contenido,
        "fecha": comment.fecha_creacion.isoformat(),
        "autora": {
            "id": comment.autora.id,
            "nombre": comment.autora.nombre,
            "avatar": comment.autora.avatar,
        }
    }), 201


@comments_bp.route("/item/<int:comment_id>", methods=["PUT"])
@jwt_required()
def editar_comment(comment_id):
    user_id = get_jwt_identity()
    comment = Comment.query.get_or_404(comment_id)

    if str(comment.user_id) != str(user_id):
        return jsonify({"error": "No puedes editar este comentario."}), 403

    data = request.get_json(silent=True)
    if not data or not data.get("contenido", "").strip():
        return jsonify({"error": "El comentario no puede estar vacio."}), 400

    comment.contenido = data["contenido"].strip()
    db.session.commit()

    return jsonify({
        "id": comment.id,
        "contenido": comment.contenido,
        "fecha": comment.fecha_creacion.isoformat(),
        "autora": {
            "id": comment.autora.id,
            "nombre": comment.autora.nombre,
            "avatar": comment.autora.avatar,
        }
    }), 200


@comments_bp.route("/item/<int:comment_id>", methods=["DELETE"])
@jwt_required()
def borrar_comment(comment_id):
    user_id = get_jwt_identity()
    comment = Comment.query.get_or_404(comment_id)

    if str(comment.user_id) != str(user_id):
        return jsonify({"error": "No puedes borrar este comentario."}), 403

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"mensaje": "Comentario eliminado."}), 200