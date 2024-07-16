import { Component } from '@angular/core';
import { OrganizerListEventsComponent } from './organizer-list-events/organizer-list-events.component';
import { OrganizerSingleEventComponent } from './organizer-single-event/organizer-single-event.component';
import { OrganizerCreateEventComponent } from './organizer-create-event/organizer-create-event.component';
import { OrganizerEditEventComponent } from './organizer-edit-event/organizer-edit-event.component';
import { OrganizerDeleteEventComponent } from './organizer-delete-event/organizer-delete-event.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organizer-events',
  standalone: true,
  imports: [CommonModule, OrganizerListEventsComponent, OrganizerSingleEventComponent, OrganizerCreateEventComponent, OrganizerEditEventComponent, OrganizerDeleteEventComponent],
  templateUrl: './organizer-events.component.html',
  styleUrl: './organizer-events.component.css'
})
export class OrganizerEventsComponent {
  showCreateEvent = false;
  showSingleEvent = false;
  showEditEvent = false;
  showDeleteEvent = false;
  selectedEventId: string | null = null;

  onCreateEvent(): void {
    this.resetViews();
    this.showCreateEvent = true;
  }

  onViewEvent(eventId: string): void {
    this.resetViews();
    this.showSingleEvent = true;
    this.selectedEventId = eventId;
  }

  onEditEvent(eventId: string): void {
    this.resetViews();
    this.showEditEvent = true;
    this.selectedEventId = eventId;
  }

  onDeleteEvent(eventId: string): void {
    this.resetViews();
    this.showDeleteEvent = true;
    this.selectedEventId = eventId;
  }

  onClose(): void {
    this.resetViews();
  }

  private resetViews(): void {
    this.showCreateEvent = false;
    this.showSingleEvent = false;
    this.showEditEvent = false;
    this.showDeleteEvent = false;
    this.selectedEventId = null;
  }
}
