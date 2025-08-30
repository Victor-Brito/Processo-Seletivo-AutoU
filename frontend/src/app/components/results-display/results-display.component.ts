import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailAnalysis } from '../email-processor/email-processor.component';

@Component({
  selector: 'app-results-display',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './results-display.component.html', 
  styleUrls: ['./results-display.component.scss']  
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