import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

def create_app():
    """Application factory function."""
    load_dotenv()
    
    app = Flask(__name__)
    
    CORS(app, origins="http://localhost:4200")

    try:
        gemini_key = os.getenv("GEMINI_API_KEY")
        if not gemini_key:
            raise ValueError("A variável de ambiente GEMINI_API_KEY não foi definida.")
        genai.configure(api_key=gemini_key)
    except Exception as e:
        print(f"Erro ao configurar a API do Gemini: {e}")

    from .api.routes import bp as api_blueprint
    app.register_blueprint(api_blueprint)

    return app