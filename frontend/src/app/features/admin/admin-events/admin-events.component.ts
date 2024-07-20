import { Component } from '@angular/core';
import Event from '../../../shared/models/Event';
import { EventService } from '../../../core/services/event.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.css'
})
export class AdminEventsComponent {
  events: Event[] = [];
  paginatedEvents: Event[] = [];
  selectedEvent: Event | null = null;
  viewMode: 'default' | 'view' | 'feature' | 'exclude' = 'default';
  currentPage: number = 1;
  eventsPerPage: number = 10;
  totalPages: number = 1;
  errorMessage: string = '';
  successMessage: string = '';

  analytics: any = {
    all_events: 0,
    featured_events: 0,
    upcoming_events: 0,
    past_events: 0,
    deleted_events: 0,
    average_rating: 0,
    total_reviews: 0
  };

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.fetchEvents();
    this.fetchAnalytics();
  }

  fetchEvents(): void {
    this.eventService.getAllEvents().subscribe(events => {
      this.events = events;
      this.totalPages = Math.ceil(this.events.length / this.eventsPerPage);
      this.updatePaginatedEvents();
    });
  }

  fetchAnalytics(): void {
    this.eventService.getEventAnalytics().subscribe(analytics => {
      this.analytics = analytics;
    });
  }

  filterEvents(type: 'all' | 'featured' | 'upcoming' | 'past' | 'deleted'): void {
    switch (type) {
      case 'all':
        this.eventService.getAllEvents().subscribe(events => {
          this.events = events;
          this.totalPages = Math.ceil(this.events.length / this.eventsPerPage);
          this.updatePaginatedEvents();
        });
        break;
      case 'featured':
        this.eventService.getFeaturedEvents().subscribe(events => {
          this.events = events;
          this.totalPages = Math.ceil(this.events.length / this.eventsPerPage);
          this.updatePaginatedEvents();
        });
        break;
      case 'upcoming':
        this.eventService.getUpcomingEvents().subscribe(events => {
          this.events = events;
          this.totalPages = Math.ceil(this.events.length / this.eventsPerPage);
          this.updatePaginatedEvents();
        });
        break;
      case 'past':
        this.eventService.getPastEvents().subscribe(events => {
          this.events = events;
          this.totalPages = Math.ceil(this.events.length / this.eventsPerPage);
          this.updatePaginatedEvents();
        });
        break;
      case 'deleted':
        this.eventService.getDeletedEvents().subscribe(events => {
          this.events = events;
          this.totalPages = Math.ceil(this.events.length / this.eventsPerPage);
          this.updatePaginatedEvents();
        });
        break;
    }
  }

  updatePaginatedEvents(): void {
    const start = (this.currentPage - 1) * this.eventsPerPage;
    const end = start + this.eventsPerPage;
    this.paginatedEvents = this.events.slice(start, end);
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

  getEventStatus(event: Event): string {
    if (event.is_deleted) return 'Deleted';
    if (event.is_featured) return 'Featured';
    if (event.date > new Date()) return 'Upcoming';
    if (event.date < new Date()) return 'Past';
    return 'Active'; //!
  }

  showView(event: Event): void {
    this.selectedEvent = event;
    this.viewMode = 'view';
  }

  showFeature(event: Event): void {
    this.selectedEvent = event;
    this.viewMode = 'feature';
  }

  showExclude(event: Event): void {
    this.selectedEvent = event;
    this.viewMode = 'exclude';
  }

  resetView(): void {
    this.selectedEvent = null;
    this.viewMode = 'default';
  }

  clearErrors() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  featureEvent(): void {
    if (this.selectedEvent) {
      this.eventService.featureEvent(this.selectedEvent.id as string).subscribe({
        next: data => {
          this.successMessage = 'Event featured successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchEvents();
            this.fetchAnalytics();
            this.resetView();
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

  excludeEvent(): void {
    if (this.selectedEvent) {
      this.eventService.removeFeaturedEvent(this.selectedEvent.id as string).subscribe({
        next: data => {
          this.successMessage = 'Event excluded from featured successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchEvents();
            this.fetchAnalytics();
            this.resetView();
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
}
