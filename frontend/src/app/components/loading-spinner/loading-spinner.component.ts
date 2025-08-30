import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container">
      <div class="spinner"></div>
      <p class="loading-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem 2rem; text-align: center; }
    .spinner { width: 3rem; height: 3rem; border: 4px solid #e5e7eb; border-top: 4px solid #2563eb; border-radius: 50%; animation: spin 1s linear infinite; }
    .loading-message { font-size: 1.1rem; font-weight: 600; color: #374151; margin-top: 1.5rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message = 'Carregando...';
}