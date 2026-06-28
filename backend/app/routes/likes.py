# backend/app/routes/likes.py

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.like import Like

likes_bp = Blueprint("likes", __name__)


@likes_bp.route("/<int:post_id>", methods=["POST"])
@jwt_required()
def dar_like(post_id):
    user_id = get_jwt_identity()

    # ¿Ya existe este like?
    ya_existe = Like.query.filter_by(user_id=user_id, post_id=post_id).first()
    if ya_existe:
        return jsonify({"error": "Ya diste like a este post"}), 400

    nuevo_like = Like(user_id=user_id, post_id=post_id)
    db.session.add(nuevo_like)
    db.session.commit()

    total = Like.query.filter_by(post_id=post_id).count()
    return jsonify({"mensaje": "Like añadido", "likes": total}), 201


@likes_bp.route("/<int:post_id>", methods=["DELETE"])
@jwt_required()
def quitar_like(post_id):
    user_id = get_jwt_identity()

    like = Like.query.filter_by(user_id=user_id, post_id=post_id).first()
    if not like:
        return jsonify({"error": "No habías dado like"}), 404

    db.session.delete(like)
    db.session.commit()

    total = Like.query.filter_by(post_id=post_id).count()
    return jsonify({"mensaje": "Like eliminado", "likes": total}), 200