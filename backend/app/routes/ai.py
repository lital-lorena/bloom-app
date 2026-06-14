import os

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from groq import Groq

ai_bp = Blueprint("ai", __name__, url_prefix="/api/ai")


@ai_bp.route("/suggest", methods=["POST"])
@jwt_required()
def suggest():
    """Mejora el borrador de un post usando Groq."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return jsonify({"error": "GROQ_API_KEY no configurada."}), 500

    data = request.get_json(silent=True)
    if not data or not data.get("texto", "").strip():
        return jsonify({"error": "El texto es obligatorio."}), 400

    texto = data["texto"].strip()

    client = Groq(api_key=api_key)
    completion = client.chat.completions.create(
       model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "Eres una asistente que ayuda a mujeres a redactar publicaciones "
                    "para Bloom, una red social de reinvención profesional. "
                    "Mejora el texto que te envían: hazlo más claro, cálido y motivador, "
                    "manteniendo la voz de la autora. Responde solo con el texto mejorado."
                ),
            },
            {"role": "user", "content": texto},
        ],
        max_tokens=500,
    )

    sugerencia = completion.choices[0].message.content.strip()
    return jsonify({"sugerencia": sugerencia}), 200
