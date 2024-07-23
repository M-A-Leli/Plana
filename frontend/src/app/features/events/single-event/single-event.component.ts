import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { EventService } from '../../../core/services/event.service';
import IEvent from '../../../shared/models/Event';
import TicketType from '../../../shared/models/TicketTypes';
import { TicketTypesService } from '../../../core/services/ticket-types.service';

@Component({
  selector: 'app-single-event',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './single-event.component.html',
  styleUrl: './single-event.component.css'
})
export class SingleEventComponent {

  event!: IEvent;
  relatedEvents: IEvent[] = [];
  currentImageIndex = 0;
  ticketTypes: TicketType[] = [];
  newTicket = {

  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private ticketTypeService: TicketTypesService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(eventId);
      this.loadRelatedEvents(eventId);
      this.loadTicketTypes(eventId);
    }
  }

  loadEvent(eventId: string): void {
    this.eventService.getEventById(eventId).subscribe((data: IEvent) => {
      this.event = data;
    });
  }

  loadRelatedEvents(eventId: string): void {
    this.eventService.getRelatedEvents(eventId).subscribe((data: IEvent[]) => {
      this.relatedEvents = data;
    });
  }

  loadTicketTypes(eventId: string): void {
    this.ticketTypeService.getTicketTypesByEventId(eventId).subscribe((data: TicketType[]) => {
      this.ticketTypes = data;
    });
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextImage(): void {
    if (this.currentImageIndex < (this.event.images?.length || 1) - 1) {
      this.currentImageIndex++;
    }
  }

  viewEvent(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }

  viewOrganizerEvents(organizerId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/events/organizer', organizerId]);
  }

  getRatingArray(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return [
      ...Array(fullStars).fill('fa-star'),
      ...Array(halfStars).fill('fa-star-half-o'),
      ...Array(emptyStars).fill('fa-star-o')
    ];
  }

  purchase() {

  }
}
