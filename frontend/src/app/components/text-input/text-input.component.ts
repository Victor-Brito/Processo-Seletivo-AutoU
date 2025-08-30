import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="text-input">
      <div class="input-header">
        <label for="emailText" class="input-label">Conteúdo do Email</label>
        <span class="char-counter">{{ emailText().length }}/5000</span>
      </div>
      <div class="input-container">
        <textarea
          id="emailText"
          [ngModel]="emailText()"
          (ngModelChange)="onTextChange($event)"
          placeholder="Cole aqui o conteúdo do email..."
          [disabled]="isProcessing"
          rows="10">
        </textarea>
      </div>
      <div class="input-footer">
        <span class="tip">Para melhores resultados, inclua todo o texto.</span>
        <button
          class="submit-btn"
          [disabled]="!canSubmit()"
          (click)="onSubmit()">
          <div *ngIf="isProcessing" class="spinner"></div>
          {{ isProcessing ? 'Analisando...' : 'Analisar Email' }}
        </button>
      </div>
    </div>
  `,
  // Você pode adicionar os styles que já tinha aqui se quiser
  styles: [`
    .text-input { width: 100%; }
    .input-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
    .input-label { font-weight: 600; }
    .char-counter { font-size: 0.8rem; color: #666; }
    textarea { width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; box-sizing: border-box; }
    .input-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; }
    .tip { font-size: 0.8rem; color: #666; }
    .submit-btn { padding: 0.5rem 1rem; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
    .submit-btn:disabled { background-color: #ccc; }
    .spinner { width: 1rem; height: 1rem; border: 2px solid transparent; border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class TextInputComponent {
  @Input() isProcessing = false;
  
  @Output() textSubmitted = new EventEmitter<string>();

  emailText = signal('');

  onTextChange(text: string) {
    this.emailText.set(text);
  }

  canSubmit(): boolean {
    return this.emailText().length >= 10 && !this.isProcessing;
  }

  onSubmit() {
    if (this.canSubmit()) {
      this.textSubmitted.emit(this.emailText());
    }
  }
}