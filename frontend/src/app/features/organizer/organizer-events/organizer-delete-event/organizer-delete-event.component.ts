import { Component, Input } from '@angular/core';
import { EventService } from '../../../../core/services/event.service';
import Event from '../../../../shared/models/Event';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organizer-delete-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organizer-delete-event.component.html',
  styleUrl: './organizer-delete-event.component.css'
})
export class OrganizerDeleteEventComponent {
  // @Input() eventId: string= '';
  // event!: Event;
  // isDeleted: boolean = false;
  // errorMessage: string = '';

  // constructor(private eventService: EventService) { }

  // ngOnInit(): void {
  //   this.loadEvent();
  // }

  // loadEvent(): void {
  //   this.eventService.getEventById(this.eventId).subscribe(
  //     event => {
  //       this.event = event;
  //     },
  //     error => {
  //       console.error('Error loading event:', error);
  //       this.errorMessage = 'Error loading event details.';
  //     }
  //   );
  // }

  // confirmDelete(): void {
  //   this.eventService.deleteEvent(this.eventId).subscribe(
  //     () => {
  //       console.log('Event deleted successfully');
  //       this.isDeleted = true;
  //       // Handle successful deletion (e.g., close the delete form, show a success message, etc.)
  //     },
  //     error => {
  //       console.error('Error deleting event:', error);
  //       this.errorMessage = 'Error deleting event. Please try again.';
  //       // Handle error (e.g., show an error message)
  //     }
  //   );
  // }
}
