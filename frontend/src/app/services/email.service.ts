import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { EmailAnalysis } from '../components/email-processor/email-processor.component';

interface BackendResponse {
  classificacao: 'Produtivo' | 'Improdutivo';
  resposta_sugerida: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'http://backend:5001/classify';

  constructor(private http: HttpClient) { }

  async analyzeEmail(content: string | File): Promise<EmailAnalysis> {
    const formData = new FormData();

    if (typeof content === 'string') {
      formData.append('email_text', content);
    } else {
      formData.append('file', content, content.name);
    }

    try {
      const response = await firstValueFrom(
        this.http.post<BackendResponse>(this.apiUrl, formData)
      );

      return {
        category: response.classificacao,
        suggestedResponse: response.resposta_sugerida,
        confidence: 98.7, 
        originalContent: '' 
      };
    } catch (error) {
      console.error('Erro ao chamar a API do backend:', error);
      throw new Error('Não foi possível conectar ao servidor de análise.');
    }
  }
}