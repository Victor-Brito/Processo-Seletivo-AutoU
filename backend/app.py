import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import PyPDF2
import re

import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer


try:
    stopwords.words('portuguese')
except LookupError:
    print("Baixando recursos do NLTK (stopwords)...")
    nltk.download('stopwords')
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    print("Baixando recursos do NLTK (punkt)...")
    nltk.download('punkt')


load_dotenv()

app = Flask(__name__)
#CORS(app, origins="http://localhost:4200")

try:
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        raise ValueError("A variável de ambiente GEMINI_API_KEY não foi definida.")
    genai.configure(api_key=gemini_key)
except Exception as e:
    print(f"Erro ao configurar a API do Gemini: {e}")

@app.route("/api")
def hello():
    return {"msg": "Hello World"}

def preprocess_text_com_nltk(text):

    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text, re.I|re.A)
    
    tokens = word_tokenize(text, language='portuguese')
    
    stop_words = set(stopwords.words('portuguese'))
    filtered_tokens = [word for word in tokens if word not in stop_words]
    
    stemmer = PorterStemmer()
    stemmed_tokens = [stemmer.stem(word) for word in filtered_tokens]
    
    return " ".join(stemmed_tokens)

def get_gemini_response(email_content: str) -> str:
    model = genai.GenerativeModel('gemini-1.5-flash',
                                  generation_config={"response_mime_type": "application/json"})
    prompt = f"""
    Analise o conteúdo do seguinte email e o classifique como "Produtivo" ou "Improdutivo".
    Além disso, gere uma resposta curta e adequada baseada na classificação.

    - "Produtivo": emails que exigem uma ação.
    - "Improdutivo": emails que não exigem ação.

    Retorne sua análise estritamente no seguinte formato JSON:
    {{
      "classificacao": "...",
      "resposta_sugerida": "..."
    }}

    Conteúdo do Email:
    ---
    {email_content}
    ---
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Erro na chamada da API do Gemini: {e}")
        return '{"error": "Não foi possível processar a solicitação com a IA."}'


@app.route('/classify', methods=['POST'])
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

    original_content = content 
    
    processed_content = preprocess_text_com_nltk(original_content)
    
    print("--- Texto Original ---")
    print(original_content)
    print("--- Texto Pré-Processado (Com NLTK) ---")
    print(processed_content)
    print("---------------------------------------------")

    gemini_result = get_gemini_response(original_content)
    
    return gemini_result, 200, {'Content-Type': 'application/json'}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)