import { Component } from '@angular/core';
import Ticket from '../../shared/models/Ticket';
import { TicketService } from '../../core/services/ticket.service';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent {
  tickets: Ticket[] = [];
  paginatedTickets: Ticket[] = [];
  selectedTicket: Ticket | null = null;
  currentPage: number = 1;
  ticketsPerPage: number = 10;
  totalPages: number = 1;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private ticketService: TicketService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.fetchTickets();
  }

  updatePaginatedTickets(): void {
    const start = (this.currentPage - 1) * this.ticketsPerPage;
    const end = start + this.ticketsPerPage;
    this.paginatedTickets = this.tickets.slice(start, end);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedTickets();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedTickets();
    }
  }

  clearErrors() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  fetchTickets(): void {
    this.ticketService.getTicketsByUserId().subscribe(tickets => {
      this.tickets = tickets;
      this.totalPages = Math.ceil(this.tickets.length / this.ticketsPerPage);
      this.updatePaginatedTickets();
    });
  }

  increaseQuantity(ticket: Ticket): void {
    if (ticket.quantity > 1 && ticket.ticket_type && ticket.ticket_type.price) {
      ticket.quantity++;

      const updatedTicket: Partial<Ticket> = {
        quantity: ticket.quantity
      }

      this.ticketService.updateTicket(ticket.id as string, updatedTicket).subscribe({
        next: data => {
          this.successMessage = 'Ticket updated successfull!';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: err => {
          if (err.status === 401 || err.status === 404 || err.status === 400) {
            this.errorMessage = err.error.error.message;
            this.clearErrors();
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
            this.clearErrors();
          }
        }
      });

      ticket.subtotal = ticket.ticket_type.price * ticket.quantity;
    }
  }

  decreaseQuantity(ticket: Ticket): void {
    if (ticket.quantity > 1 && ticket.ticket_type && ticket.ticket_type.price) {
      ticket.quantity--;

      const updatedTicket: Partial<Ticket> = {
        quantity: ticket.quantity
      }

      this.ticketService.updateTicket(ticket.id as string, updatedTicket).subscribe({
        next: data => {
          this.successMessage = 'Ticket updated successfull!';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: err => {
          if (err.status === 401 || err.status === 404 || err.status === 400) {
            this.errorMessage = err.error.error.message;
            this.clearErrors();
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
            this.clearErrors();
          }
        }
      });

      ticket.subtotal = ticket.ticket_type.price * ticket.quantity;
    }
  }

  calculateTotal(): number {
    return this.tickets.reduce((total, ticket) => total + ticket.subtotal, 0);
  }

  removeTicket(ticket_id: string): void {
    this.ticketService.deleteTicket(ticket_id).subscribe({
      next: data => {
        this.successMessage = 'Ticket removed successfull!';
        setTimeout(() => {
          this.successMessage = '';
          this.fetchTickets();
          this.updatePaginatedTickets();
        }, 3000);
      },
      error: err => {
        if (err.status === 401 || err.status === 404 || err.status === 400) {
          this.errorMessage = err.error.error.message;
          this.clearErrors();
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
          this.clearErrors();
        }
      }
    });
  }

  checkout(): void {
    this.orderService.checkoutOrder().subscribe({
      next: data => {
        this.successMessage = 'Order created successfull!';
        setTimeout(() => {
          this.successMessage = '';
          this.fetchTickets();
          this.updatePaginatedTickets();
        }, 3000);
      },
      error: err => {
        if (err.status === 401 || err.status === 404 || err.status === 400) {
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
