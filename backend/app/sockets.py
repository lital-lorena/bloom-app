from flask_socketio import join_room
from flask_jwt_extended import decode_token
from app.extensions import socketio


@socketio.on("conectar_usuaria")
def conectar_usuaria(data):
    try:
        token = data.get("token")
        decoded = decode_token(token)
        user_id = decoded["sub"]
        join_room(f"user_{user_id}")
        print(f"Usuaria {user_id} conectada a su sala")
    except Exception as e:
        print(f"Error al conectar usuaria: {e}")