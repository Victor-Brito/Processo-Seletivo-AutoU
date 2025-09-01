import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer

def preprocess_text(text):
    """Realiza o pré-processamento NLP em um texto."""
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text, re.I|re.A)
    
    tokens = word_tokenize(text, language='portuguese')
    
    stop_words = set(stopwords.words('portuguese'))
    filtered_tokens = [word for word in tokens if word not in stop_words]
    
    stemmer = PorterStemmer()
    stemmed_tokens = [stemmer.stem(word) for word in filtered_tokens]
    
    print("--- Texto Pré-Processado (Com NLTK) ---")
    print(" ".join(stemmed_tokens))
    print("---------------------------------------------")
    
    return " ".join(stemmed_tokens)