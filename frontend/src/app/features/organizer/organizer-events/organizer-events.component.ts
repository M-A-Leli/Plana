import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';
import IEvent from '../../../shared/models/Event';

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
  images: File[] = [];

  analytics: any = {
    all_events: 0,
    upcoming_events: 0,
    past_events: 0,
    average_rating: 0
  };

  constructor(private fb: FormBuilder, private eventService: EventService) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      venue: ['', Validators.required],
      images: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchEvents();
    this.fetchOrganizerEventsAnalytics();
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

  // !
  hasEventStarted(eventDate: Date, eventTime: Date): boolean {
    const currentDateTime = new Date();
    const eventDateTime = new Date(eventDate);
    eventDateTime.setHours(eventTime.getHours(), eventTime.getMinutes(), eventTime.getSeconds());
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
  }

  showDelete(event: IEvent): void {
    this.selectedEvent = event;
    this.viewMode = 'delete';
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
      Array.from(this.images).forEach((image, index) => {
        formData.append(`images[${index}]`, image, image.name);
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

  updateEvent(): void {
    // if (this.selectedEvent && this.selectedEvent.eventname && this.selectedEvent.email) {
    //   this.eventsService.updateEvent(this.selectedEvent.id as string, this.selectedEvent).subscribe({
    //     next: data => {
    //       this.successMessage = 'Event updated successfull!';
    //       setTimeout(() => {
    //         this.successMessage = '';
    //         this.fetchEvents();
    //         this.fetchAnalytics();
    //         this.resetView();
    //       }, 3000);
    //     },
    //     error: err => {
    //       if (err.status === 401 || err.status === 404 || err.status === 409) {
    //         this.errorMessage = err.error.error.message;
    //         this.clearErrors();
    //       } else {
    //         this.errorMessage = 'An unexpected error occurred. Please try again.';
    //         this.clearErrors();
    //       }
    //     }
    //   });
    // }
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
