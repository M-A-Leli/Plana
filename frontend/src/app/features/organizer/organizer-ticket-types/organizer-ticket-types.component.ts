import { Component, Input } from '@angular/core';
import { TicketTypesService } from '../../../core/services/ticket-types.service';
import TicketType from '../../../shared/models/TicketTypes';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-organizer-ticket-types',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './organizer-ticket-types.component.html',
  styleUrl: './organizer-ticket-types.component.css'
})
export class OrganizerTicketTypesComponent {
  @Input() eventId: string = '';
  ticketTypes: TicketType[] = [];
  paginatedTicketTypes: TicketType[] = [];
  selectedTicketType: TicketType | null = null;
  viewMode: 'default' | 'create' | 'edit' | 'delete' = 'default';
  currentPage: number = 1;
  ticketTypesPerPage: number = 10;
  totalPages: number = 1;
  errorMessage: string = '';
  successMessage: string = '';
  ticketTypeForm: FormGroup;
  updateTicketTypeForm: FormGroup;

  constructor(private ticketTypeService: TicketTypesService, private fb: FormBuilder) {
    this.ticketTypeForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      availability: ['', Validators.required],
      group_size: ['', Validators.required]
    });

    this.updateTicketTypeForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      availability: ['', Validators.required],
      group_size: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.eventId) {
      this.fetchTicketTypes();
    }
  }

  fetchTicketTypes(): void {
    this.ticketTypeService.getTicketTypesByEventId(this.eventId).subscribe(ticketTypes => {
      this.ticketTypes = ticketTypes;
      this.totalPages = Math.ceil(this.ticketTypes.length / this.ticketTypesPerPage);
      this.updatePaginatedTicketTypes();
    });
  }

  updatePaginatedTicketTypes(): void {
    const start = (this.currentPage - 1) * this.ticketTypesPerPage;
    const end = start + this.ticketTypesPerPage;
    this.paginatedTicketTypes = this.ticketTypes.slice(start, end);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedTicketTypes();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedTicketTypes();
    }
  }

  showCreate(): void {
    this.selectedTicketType = null;
    this.viewMode = 'create';
  }

  showEdit(ticketType: TicketType): void {
    this.selectedTicketType = ticketType;
    this.viewMode = 'edit';
    this.loadTicketTypeDetails();
  }

  showDelete(ticketType: TicketType): void {
    this.selectedTicketType = ticketType;
    this.viewMode = 'delete';
  }

  resetView(): void {
    this.selectedTicketType = null;
    this.viewMode = 'default';
  }

  clearErrors() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  loadTicketTypeDetails(): void {
    if (this.selectedTicketType) {
      this.updateTicketTypeForm.patchValue(this.selectedTicketType);
    }
  }

  createTicketType(): void {
    if (this.ticketTypeForm.valid) {
      const ticketType: TicketType = {
        ...this.ticketTypeForm.value,
        event_id: this.eventId,
      };

      this.ticketTypeService.createTicketType(ticketType).subscribe({
        next: data => {
          this.successMessage = 'Ticket type created successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchTicketTypes();
            this.updatePaginatedTicketTypes();
            this.resetView();
          }, 3000);
        },
        error: err => {
          if (err.status === 401 || err.status === 404 || err.status === 409) {
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

  updateTicketType(): void {
    if (this.updateTicketTypeForm.valid) {
      const ticketType: TicketType = {
        ...this.updateTicketTypeForm.value,
      };

      this.ticketTypeService.updateTicketType(this.selectedTicketType?.id as string, ticketType).subscribe({
        next: data => {
          this.successMessage = 'Ticket type updated successfully!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchTicketTypes();
            this.updatePaginatedTicketTypes();
            this.resetView();
          }, 3000);
        },
        error: err => {
          if (err.status === 401 || err.status === 404 || err.status === 409) {
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

  deleteTicketType(): void {
    if (this.selectedTicketType) {
      this.ticketTypeService.deleteTicketType(this.selectedTicketType.id as string).subscribe({
        next: () => {
          this.successMessage = 'Ticket type deleted successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchTicketTypes();
            this.updatePaginatedTicketTypes();
            this.resetView();
          }, 3000);
        },
        error: err => {
          if (err.status === 401 || err.status === 404|| err.status === 400) {
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
}
