import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="file-upload">
      <div class="upload-area"
           [class.dragover]="isDragOver"
           [class.disabled]="isProcessing"
           (dragover)="onDragOver($event)"
           (dragleave)="onDragLeave($event)"
           (drop)="onDrop($event)"
           (click)="!isProcessing && fileInput.click()">

        <input #fileInput
               type="file"
               accept=".txt,.pdf"
               (change)="onFileChange($event)"
               [disabled]="isProcessing"
               style="display: none;">

        <div class="upload-content">
          <div class="upload-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12">
              </path>
            </svg>
          </div>

          <div class="upload-text">
            <p class="primary-text">
              {{ isProcessing ? 'Processando...' : 'Clique para fazer upload ou arraste o arquivo aqui' }}
            </p>
            <p class="secondary-text" *ngIf="!isProcessing">
              Suporta arquivos .txt e .pdf
            </p>
          </div>
        </div>
      </div>

      <div *ngIf="selectedFile" class="file-info">
        <div class="file-details">
          <svg class="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
            </path>
          </svg>
          <div class="file-meta">
            <span class="file-name">{{ selectedFile.name }}</span>
            <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
          </div>
        </div>
        <button class="remove-btn"
                (click)="removeFile()"
                [disabled]="isProcessing"
                title="Remover arquivo">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .file-upload { width: 100%; }
    .upload-area { border: 2px dashed #d1d5db; border-radius: 12px; padding: 3rem 2rem; text-align: center; cursor: pointer; transition: all 0.3s ease; background: #fafbfc; }
    .upload-area:hover:not(.disabled) { border-color: #2563eb; background: #f0f4ff; }
    .upload-area.dragover { border-color: #2563eb; background: #f0f4ff; transform: scale(1.02); }
    .upload-area.disabled { opacity: 0.6; cursor: not-allowed; }
    .upload-content { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .upload-icon { width: 3rem; height: 3rem; color: #6b7280; transition: color 0.3s ease; }
    .upload-area:hover:not(.disabled) .upload-icon { color: #2563eb; }
    .primary-text { font-size: 1.1rem; font-weight: 600; color: #374151; margin: 0; }
    .secondary-text { font-size: 0.875rem; color: #6b7280; margin: 0.5rem 0 0 0; }
    .file-info { display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-top: 1rem; }
    .file-details { display: flex; align-items: center; gap: 0.75rem; }
    .file-icon { width: 1.5rem; height: 1.5rem; color: #2563eb; }
    .file-meta { display: flex; flex-direction: column; gap: 0.25rem; }
    .file-name { font-weight: 500; color: #374151; }
    .file-size { font-size: 0.875rem; color: #6b7280; }
    .remove-btn { display: flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border: none; background: #ef4444; color: white; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; }
    .remove-btn:hover:not(:disabled) { background: #dc2626; transform: scale(1.05); }
    .remove-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .remove-btn svg { width: 1rem; height: 1rem; }
  `]
})
export class FileUploadComponent {
  @Input() isProcessing = false;
  @Output() fileSelected = new EventEmitter<File>();

  selectedFile: File | null = null;
  isDragOver = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (this.isProcessing) return;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File) {
    if (file.type === 'text/plain' || file.type === 'application/pdf') {
      this.selectedFile = file;
      this.fileSelected.emit(file);
    } else {
      alert('Tipo de arquivo inválido. Por favor, selecione .txt ou .pdf');
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.fileSelected.emit(undefined);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}