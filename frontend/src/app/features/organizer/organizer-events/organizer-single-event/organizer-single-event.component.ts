import { Component, Input } from '@angular/core';
import { EventService } from '../../../../core/services/event.service';
import Event from '../../../../shared/models/Event'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organizer-single-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organizer-single-event.component.html',
  styleUrl: './organizer-single-event.component.css'
})
export class OrganizerSingleEventComponent {
  @Input() eventId: string = '';
  event!: Event;
  currentImageIndex: number = 0;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvent();
  }

  loadEvent(): void {
    this.eventService.getEventById(this.eventId).subscribe(
      event => {
        this.event = event;
      },
      error => {
        console.error('Error loading event:', error);
      }
    );
  }

  nextImage(): void {
    if (this.event.images && this.currentImageIndex < this.event.images.length - 1) {
      this.currentImageIndex++;
    }
  }

  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }
}
