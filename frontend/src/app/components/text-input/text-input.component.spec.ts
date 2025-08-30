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
        <label for="emailText" class="input-label">
          <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
            </path>
          </svg>
          Conteúdo do Email
        </label>
        <span class="char-counter"
              [class.warning]="emailText().length > 4500"
              [class.error]="emailText().length >= 5000">
          {{ emailText().length }}/5000
        </span>
      </div>

      <div class="input-container">
        <textarea
          id="emailText"
          [ngModel]="emailText()"
          (ngModelChange)="onTextChange($event)"
          placeholder="Cole aqui o conteúdo do email que você deseja analisar..."
          [disabled]="isProcessing"
          maxlength="5000"
          rows="12">
        </textarea>
      </div>

      <div class="input-footer">
        <div class="tips">
          <svg class="tip-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
            </path>
          </svg>
          <span>Para melhores resultados, inclua o assunto e corpo completo do email</span>
        </div>

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
  styles: [`
    .text-input { width: 100%; }
    .input-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .input-label { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #374151; }
    .label-icon { width: 1.25rem; height: 1.25rem; }
    .char-counter { font-size: 0.875rem; color: #6b7280; }
    .char-counter.warning { color: #d97706; }
    .char-counter.error { color: #dc2626; }
    .input-container { position: relative; margin-bottom: 1rem; }
    textarea { width: 100%; min-height: 250px; padding: 1rem; border: 2px solid #e5e7eb; border-radius: 8px; resize: vertical; transition: all 0.2s ease; }
    textarea:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
    textarea:disabled { background: #f9fafb; cursor: not-allowed; }
    .input-footer { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
    .tips { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: #6b7280; }
    .tip-icon { width: 1.25rem; height: 1.25rem; flex-shrink: 0; }
    .submit-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
    .submit-btn:hover:not(:disabled) { background: #1d4ed8; }
    .submit-btn:disabled { background: #9ca3af; cursor: not-allowed; }
    .spinner { width: 1rem; height: 1rem; border: 2px solid transparent; border-top: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite; }
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