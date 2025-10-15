import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert alert-danger" role="alert" *ngIf="message">
      <i class="fas fa-exclamation-triangle me-2"></i>
      {{ message }}
    </div>
  `,
  styles: [`
    .alert {
      border-radius: 10px;
      border: none;
      padding: 1rem 1.5rem;
      margin-bottom: 1rem;
    }
    
    .alert-danger {
      background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
      color: #721c24;
    }
  `]
})
export class ErrorMessageComponent {
  @Input() message: string = '';
}
