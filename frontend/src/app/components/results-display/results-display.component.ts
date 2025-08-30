import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailAnalysis } from '../email-processor/email-processor.component';

@Component({
  selector: 'app-results-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="results-display">
      <div class="results-header">
        <h2 class="results-title">Análise Completa</h2>
      </div>

      <div class="results-grid">
        <div class="result-card">
          <div class="card-header">
            <h3>Categoria do Email</h3>
          </div>
          <div class="category-badge" [ngClass]="getCategoryClass()">
            {{ result.category }}
          </div>
          <p class="category-description">{{ getCategoryDescription() }}</p>
        </div>

        <div class="result-card">
          <div class="card-header">
            <h3>Resposta Sugerida</h3>
          </div>
          <div class="response-text">
            {{ result.suggestedResponse }}
          </div>
          <button class="copy-btn" (click)="copyResponse()">
            {{ copyButtonText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .results-display { width: 100%; animation: slideIn 0.4s ease-out; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .results-header { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9; }
    .results-title { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0; }
    .results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .result-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; }
    .card-header h3 { font-size: 1.1rem; font-weight: 600; color: #1e293b; margin: 0 0 1rem 0; }
    .category-badge { display: inline-block; padding: 0.5rem 1rem; border-radius: 99px; font-weight: 600; margin-bottom: 1rem; }
    .category-badge.produtivo { background: #dcfce7; color: #166534; }
    .category-badge.improdutivo { background: #fef2f2; color: #dc2626; }
    .category-description { font-size: 0.875rem; color: #64748b; line-height: 1.5; margin: 0; }
    .response-text { background: #f8fafc; padding: 1rem; border-radius: 8px; border-left: 4px solid #2563eb; margin-bottom: 1rem; white-space: pre-wrap; }
    .copy-btn { padding: 0.5rem 1rem; border: 1px solid #d1d5db; background: white; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; }
    .copy-btn:hover { background: #f9fafb; }
    @media (max-width: 768px) {
      .results-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ResultsDisplayComponent {
  @Input() result!: EmailAnalysis;

  copyButtonText = 'Copiar';

  getCategoryClass(): string {
    return this.result.category.toLowerCase();
  }

  getCategoryDescription(): string {
    return this.result.category === 'Produtivo'
      ? 'Este email parece exigir uma ação ou resposta.'
      : 'Este email não parece exigir uma ação imediata.';
  }

  async copyResponse() {
    try {
      await navigator.clipboard.writeText(this.result.suggestedResponse);
      this.copyButtonText = 'Copiado!';
      setTimeout(() => this.copyButtonText = 'Copiar', 2000);
    } catch (err) {
      console.error('Erro ao copiar texto:', err);
    }
  }
}