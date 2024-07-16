import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../../core/services/event.service';
import Event from '../../../../shared/models/Event'

@Component({
  selector: 'app-organizer-list-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organizer-list-events.component.html',
  styleUrl: './organizer-list-events.component.css'
})
export class OrganizerListEventsComponent {
  events: Event[] = [];
  paginatedEvents: Event[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalItems: number = 0;

  @Output() viewEvent = new EventEmitter<string>();
  @Output() editEvent = new EventEmitter<string>();
  @Output() deleteEvent = new EventEmitter<string>();

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.eventService.getAllEvents().subscribe((data: Event[]) => {
      this.totalItems = data.length;
      this.events = data.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.fetchEvents();
  }

  onView(eventId: string): void {
    this.viewEvent.emit(eventId);
  }

  onEdit(eventId: string): void {
    this.editEvent.emit(eventId);
  }

  onDelete(eventId: string): void {
    this.deleteEvent.emit(eventId);
  }

  paginate() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEvents = this.events.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.events.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }
}
