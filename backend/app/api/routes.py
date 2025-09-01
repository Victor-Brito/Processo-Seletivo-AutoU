from flask import Blueprint, request, jsonify
from app.services import nlp_service, gemini_service
import PyPDF2

bp = Blueprint('api', __name__)

# Rota para classificar o email e gerar resposta sugerida
@bp.route('/classify', methods=['POST'])
def classify_email():
    content = ""
    
    if 'email_text' in request.form:
        content = request.form['email_text']
    elif 'file' in request.files:
        file = request.files['file']
        if file.filename.endswith('.txt'):
            content = file.read().decode('utf-8')
        elif file.filename.endswith('.pdf'):
            try:
                reader = PyPDF2.PdfReader(file.stream)
                for page in reader.pages:
                    content += page.extract_text()
            except Exception as e:
                return jsonify({"error": f"Erro ao ler o PDF: {e}"}), 400

    if not content:
        return jsonify({"error": "Nenhum conteúdo de email fornecido."}), 400

    print("--- Texto Original ---")
    print(content)
    
    # Chama os serviços do NLP e Gemini
    nlp_service.preprocess_text(content)
    gemini_result = gemini_service.get_analysis(content)
    
    return gemini_result, 200, {'Content-Type': 'application/json'}

@bp.route("/api")
def hello():
    return {"msg": "Hello Docker"}