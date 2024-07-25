import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import IEvent from '../../../shared/models/Event';
import { AuthService } from '../../../core/services/auth.service';
import { EventService } from '../../../core/services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-featured-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-events.component.html',
  styleUrl: './featured-events.component.css'
})
export class FeaturedEventsComponent {
  events: IEvent[] = [];

  constructor(private eventService: EventService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadEvents();
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

  loadEvents() {
    this.eventService.getFeaturedEvents().subscribe((data: IEvent[]) => {
      this.events = data;
    });
  }

  viewEventDetails(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }

  viewOrganizerEvents(organizerId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/events/organizer', organizerId]);
  }
}
