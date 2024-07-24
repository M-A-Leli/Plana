import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';
import IEvent from '../../../shared/models/Event';
import { CategoryService } from '../../../core/services/category.service';
import Category from '../../../shared/models/Category';

@Component({
  selector: 'app-organizer-events',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './organizer-events.component.html',
  styleUrl: './organizer-events.component.css'
})
export class OrganizerEventsComponent {
  events: IEvent[] = [];
  paginatedEvents: IEvent[] = [];
  selectedEvent: IEvent | null = null;
  viewMode: 'default' | 'view' | 'create' | 'edit' | 'delete' = 'default';
  currentPage: number = 1;
  eventsPerPage: number = 10;
  totalPages: number = 1;
  errorMessage: string = '';
  successMessage: string = '';

  eventForm: FormGroup;
  updateEventForm: FormGroup;
  images: File[] = [];

  categories: Category[] = [];
  selectedCategoryId: string = '';

  @Output() navigate = new EventEmitter<string>();
  @Output() eventSelected = new EventEmitter<string>();

  analytics: any = {
    all_events: 0,
    upcoming_events: 0,
    past_events: 0,
    average_rating: 0
  };

  constructor(private fb: FormBuilder, private eventService: EventService, private categoryService: CategoryService) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      venue: ['', Validators.required],
      category_id: ['', Validators.required],
      images: [null, Validators.required]
    });

    this.updateEventForm = this.fb.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      date: [null, Validators.required],
      start_time: [null, Validators.required],
      end_time: [null, Validators.required],
      venue: [null, Validators.required],
      category_id: [null, Validators.required],
      images: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchEvents();
    this.fetchOrganizerEventsAnalytics();
    this.fetchCategories();
  }

  fetchEvents(): void {
    this.eventService.getOrganizersEvents().subscribe(events => {
      this.events = events;
      this.totalPages = Math.ceil(this.events.length / this.eventsPerPage);
      this.updatePaginatedEvents();
    });
  }

  fetchOrganizerEventsAnalytics(): void {
    this.eventService.getOrganizersEventsAnalytics().subscribe(analytics => {
      this.analytics = analytics;
    });
  }

  fetchCategories(): void {
    this.categoryService.getActiveCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  filterEvents(type: 'all' | 'upcoming' | 'past'): void {
    switch (type) {
      case 'all':
        this.eventService.getOrganizersEvents().subscribe(events => {
          this.events = events;
          this.totalPages = Math.ceil(this.events.length / this.eventsPerPage);
          this.updatePaginatedEvents();
        });
        break;
      case 'upcoming':
        this.eventService.getOrganizersUpcomingEvents().subscribe(events => {
          this.events = events;
          this.totalPages = Math.ceil(this.events.length / this.eventsPerPage);
          this.updatePaginatedEvents();
        });
        break;
      case 'past':
        this.eventService.getOrganizersPastEvents().subscribe(events => {
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

  getEventStatus(event: IEvent): string {
    let status = '';
    if (event.date > new Date())
      status = 'Upcoming';
    if (event.date < new Date())
      status = 'Past';
    return status;
  }

  hasEventStarted(eventDate: Date, start_time: string): boolean {
    const currentDateTime = new Date();
    const eventDateTime = new Date(eventDate);

    // Parse start_time in the format HH:mm
    const [startHours, startMinutes] = start_time.split(':').map(Number);

    eventDateTime.setHours(startHours, startMinutes, 0);

    return currentDateTime >= eventDateTime;
  }

  showView(event: IEvent): void {
    this.selectedEvent = event;
    this.viewMode = 'view';
  }

  showCreate(): void {
    this.selectedEvent = null;
    this.viewMode = 'create';
  }

  showEdit(event: IEvent): void {
    this.selectedEvent = event;
    this.viewMode = 'edit';
    this.loadEventDetails();
  }

  showDelete(event: IEvent): void {
    this.selectedEvent = event;
    this.viewMode = 'delete';
  }

  showTicketTypes(event: IEvent): void {
    this.eventSelected.emit(event.id);
    this.navigate.emit('ticket-types');
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

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files.length > 4) {
      alert('You can only upload up to 4 images');
      return;
    }
    this.images = files;
    this.eventForm.patchValue({ images: this.images });
  }

  createEvent(): void {
    if (this.eventForm.valid) {
      const event: IEvent = {
        ...this.eventForm.value,
      };

      const formData = new FormData();
      formData.append('title', event.title);
      formData.append('description', event.description);
      formData.append('date', event.date.toString());
      formData.append('start_time', event.start_time.toString());
      formData.append('end_time', event.end_time.toString());
      formData.append('venue', event.venue);
      formData.append('category_id', event.category_id as string);
      Array.from(this.images).forEach((image, index) => {
        // formData.append(`images[${index}]`, image, image.name);
        formData.append(`images`, image, image.name);
      });

      this.eventService.createEvent(formData).subscribe({
        next: data => {
          this.successMessage = 'Event created successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchEvents();
            this.fetchOrganizerEventsAnalytics();
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

  loadEventDetails(): void {
    if (this.selectedEvent) {
      this.updateEventForm.patchValue(this.selectedEvent);
    }
  }

  updateEvent(): void {
    if (this.updateEventForm.valid) {
      const event: IEvent = {
        ...this.updateEventForm.value,
      };

      const formData = new FormData();
      formData.append('title', event.title);
      formData.append('description', event.description);
      formData.append('date', event.date.toString());
      formData.append('start_time', event.start_time.toString());
      formData.append('end_time', event.end_time.toString());
      formData.append('venue', event.venue);
      formData.append('category_id', event.category_id as string);
      Array.from(this.images).forEach((image, index) => {
        // formData.append(`images[${index}]`, image, image.name);
        formData.append(`images`, image, image.name);
      });

      this.eventService.updateEvent(this.selectedEvent?.id as string, formData).subscribe({
        next: data => {
          this.successMessage = 'Event updated successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchEvents();
            this.fetchOrganizerEventsAnalytics();
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

  deleteEvent(): void {
    if (this.selectedEvent) {
      this.eventService.deleteEvent(this.selectedEvent.id as string).subscribe({
        next: data => {
          this.successMessage = 'Event deleted successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchEvents();
            this.fetchOrganizerEventsAnalytics();
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
