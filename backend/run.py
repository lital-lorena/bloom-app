"""
Punto de entrada de la API Bloom.
Ejecutar desde backend/: python run.py
"""

import sys
from pathlib import Path

# Ruta absoluta al directorio backend (contiene la carpeta app/)
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app import create_app

flask_app = create_app()

if __name__ == "__main__":
    flask_app.run(debug=True, host="0.0.0.0", port=5000)
