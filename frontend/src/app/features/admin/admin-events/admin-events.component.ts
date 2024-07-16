import { Component } from '@angular/core';
import Event from '../../../shared/models/Event';
import { EventService } from '../../../core/services/event.service';
import { CommonModule } from '@angular/common';
import { CreateEventComponent } from './create-event/create-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { SingleEventComponent } from './single-event/single-event.component';
import { DeleteEventComponent } from './delete-event/delete-event.component';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [CommonModule, CreateEventComponent, EditEventComponent, SingleEventComponent, DeleteEventComponent],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.css'
})
export class AdminEventsComponent {
  events: Event[] = [];
  paginatedEvents: Event[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  selectedEventId: string | null = null;
  currentView: string = 'default';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe((events) => {
      this.events = events;
      this.totalPages = Math.ceil(this.events.length / this.itemsPerPage);
      this.updatePaginatedEvents();
    });
  }

  updatePaginatedEvents(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEvents = this.events.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedEvents();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedEvents();
    }
  }

  onCreate(): void {
    this.currentView = 'create';
  }

  onView(id: string): void {
    this.selectedEventId = id;
    this.currentView = 'view';
  }

  onEdit(id: string): void {
    this.selectedEventId = id;
    this.currentView = 'edit';
  }

  onDelete(id: string): void {
    this.selectedEventId = id;
    this.currentView = 'delete';
  }
}
