"""
Punto de entrada de la API Bloom.
Ejecutar desde backend/: python run.py
"""

import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app import create_app
from app.extensions import socketio

flask_app = create_app()

if __name__ == "__main__":
    socketio.run(flask_app, debug=True, host="0.0.0.0", port=5000, use_reloader=False)