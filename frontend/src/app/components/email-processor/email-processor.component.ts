import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../../services/email.service';
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

  templateUrl: './email-processor.component.html',
  styleUrls: ['./email-processor.component.scss']  
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