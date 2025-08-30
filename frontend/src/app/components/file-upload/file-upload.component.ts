import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'] 
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