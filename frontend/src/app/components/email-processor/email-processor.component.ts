import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../../services/email.service'; // Ajuste o caminho se necessário
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { TextInputComponent } from '../text-input/text-input.component';
import { ResultsDisplayComponent } from '../results-display/results-display.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

export interface EmailAnalysis {
  category: 'Produtivo' | 'Improdutivo';
  suggestedResponse: string;
  confidence: number;
  originalContent: string;
}

@Component({
  selector: 'app-email-processor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileUploadComponent,
    TextInputComponent,
    ResultsDisplayComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="email-processor">
      <div class="container">
        <header class="header">
          <h1 class="title">Processador de Emails</h1>
          <p class="subtitle">
            Analise automaticamente seus emails e receba sugestões de resposta inteligentes
          </p>
        </header>

        <div class="main-content">
          <!-- Input Method Selector -->
          <div class="method-selector">
            <button
              class="method-btn"
              [class.active]="inputMethod() === 'upload'"
              (click)="setInputMethod('upload')">
              <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              Upload de Arquivo
            </button>
            <button
              class="method-btn"
              [class.active]="inputMethod() === 'text'"
              (click)="setInputMethod('text')">
              <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Inserir Texto
            </button>
          </div>

          <!-- Input Area -->
          <div class="input-section">
            <app-file-upload
              *ngIf="inputMethod() === 'upload'"
              (fileSelected)="onFileSelected($event)"
              [isProcessing]="isProcessing()"
              class="fade-in">
            </app-file-upload>

            <app-text-input
              *ngIf="inputMethod() === 'text'"
              (textSubmitted)="onTextSubmitted($event)"
              [isProcessing]="isProcessing()"
              class="fade-in">
            </app-text-input>
          </div>

          <!-- Loading State -->
          <app-loading-spinner
            *ngIf="isProcessing()"
            message="Analisando email...">
          </app-loading-spinner>

          <!-- Results -->
          <app-results-display
            *ngIf="analysisResult() && !isProcessing()"
            [result]="analysisResult()!"
            class="fade-in">
          </app-results-display>

          <!-- Error Message -->
          <div *ngIf="errorMessage()" class="error-message fade-in">
            <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ errorMessage() }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Coloque aqui todo o CSS que você já tinha para o email-processor */
    .email-processor {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem 1rem;
    }
    .container { max-width: 900px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 3rem; }
    .title { font-size: 2.5rem; font-weight: 700; color: white; margin-bottom: 0.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .subtitle { font-size: 1.1rem; color: rgba(255,255,255,0.9); max-width: 600px; margin: 0 auto; line-height: 1.6; }
    .main-content { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
    .method-selector { display: flex; gap: 1rem; margin-bottom: 2rem; padding: 0.5rem; background: #f8fafc; border-radius: 12px; }
    .method-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; border: none; border-radius: 8px; background: transparent; color: #64748b; font-weight: 500; cursor: pointer; transition: all 0.2s ease; }
    .method-btn:hover { background: #e2e8f0; color: #475569; }
    .method-btn.active { background: #2563eb; color: white; box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
    .icon { width: 1.25rem; height: 1.25rem; }
    .input-section { margin-bottom: 2rem; }
    .error-message { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; margin-top: 1rem; }
    .error-icon { width: 1.5rem; height: 1.5rem; flex-shrink: 0; }
    .fade-in { animation: fadeIn 0.3s ease-in; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 768px) {
      .title { font-size: 2rem; }
      .main-content { padding: 1.5rem; margin: 0 0.5rem; }
      .method-selector { flex-direction: column; }
    }
  `]
})
export class EmailProcessorComponent {
  inputMethod = signal<'upload' | 'text'>('upload');
  isProcessing = signal(false);
  analysisResult = signal<EmailAnalysis | null>(null);
  errorMessage = signal<string>('');

  constructor(private emailService: EmailService) {}

  setInputMethod(method: 'upload' | 'text') {
    this.inputMethod.set(method);
    this.clearState();
  }

  onFileSelected(file: File) {
    if (!file) return;
    this.clearState();
    this.isProcessing.set(true);
    this.processEmail(file);
  }

  onTextSubmitted(text: string) {
    if (!text) return;
    this.clearState();
    this.isProcessing.set(true);
    this.processEmail(text);
  }

  private processEmail(content: string | File) {
    this.emailService.analyzeEmail(content).then(result => {
      const originalContent = typeof content === 'string' ? content : 'Conteúdo do arquivo: ' + content.name;
      this.analysisResult.set({ ...result, originalContent: originalContent });
    }).catch(error => {
      this.errorMessage.set(error.message || 'Erro ao processar o email. Tente novamente.');
    }).finally(() => {
      this.isProcessing.set(false);
    });
  }

  private clearState() {
    this.analysisResult.set(null);
    this.errorMessage.set('');
  }
}