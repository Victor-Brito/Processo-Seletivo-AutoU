import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
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