import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailProcessorComponent } from './components/email-processor/email-processor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EmailProcessorComponent], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
}