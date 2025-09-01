import google.generativeai as genai

def get_analysis(email_content: str) -> str:
    model = genai.GenerativeModel('gemini-1.5-flash',
                                  generation_config={"response_mime_type": "application/json"})
    prompt = f"""
    Analise o conteúdo do seguinte email e o classifique como "Produtivo" ou "Improdutivo".
    Além disso, gere uma resposta curta e adequada baseada na classificação, a resposta deve sofrer um processo de aprendizado por reforço (RLHF).
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