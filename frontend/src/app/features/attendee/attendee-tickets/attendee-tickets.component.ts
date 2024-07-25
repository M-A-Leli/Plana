import { Component, Input } from '@angular/core';
import Ticket from '../../../shared/models/Ticket';
import { TicketService } from '../../../core/services/ticket.service';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-attendee-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendee-tickets.component.html',
  styleUrl: './attendee-tickets.component.css'
})
export class AttendeeTicketsComponent {
  @Input() orderId: string = '';
  tickets: Ticket[] = [];
  paginatedTickets: Ticket[] = [];
  selectedTicket: Ticket | null = null;
  currentPage: number = 1;
  ticketsPerPage: number = 10;
  totalPages: number = 1;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private ticketService: TicketService, private location: Location) {}

  ngOnInit(): void {
    if (this.orderId) {
      this.fetchTickets();
      console.log(this.tickets);
    }
  }

  fetchTickets(): void {
    this.ticketService.getTicketsByOrderId(this.orderId).subscribe(tickets => {
      this.tickets = tickets;
      this.totalPages = Math.ceil(this.tickets.length / this.ticketsPerPage);
      this.updatePaginatedTickets();
    });
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

  goBack(): void {
    this.location.back();
  }
}
