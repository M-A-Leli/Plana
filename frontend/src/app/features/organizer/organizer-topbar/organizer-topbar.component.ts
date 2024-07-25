import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Ticket from '../../../shared/models/Ticket';
import { TicketService } from '../../../core/services/ticket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organizer-topbar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './organizer-topbar.component.html',
  styleUrl: './organizer-topbar.component.css'
})
export class OrganizerTopbarComponent {

  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private router: Router, private ticketService: TicketService) {}

  clearErrors() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  onVerify(code: string): void {
    this.ticketService.validateTicket(code).subscribe({
      next: data => {
        this.successMessage = 'Verification complete!';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: err => {
        if (err.status === 404) {
          this.errorMessage = 'Invalid ticket number!';
          this.clearErrors();
        } else if (err.status === 400) {
          this.errorMessage = err.error.error.message;
          this.clearErrors();
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
          this.clearErrors();
        }
      }
    });
  }
}
