import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { EventService } from '../../../core/services/event.service';
import Event from '../../../shared/models/Event';

@Component({
  selector: 'app-single-event',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './single-event.component.html',
  styleUrl: './single-event.component.css'
})
export class SingleEventComponent {

  event!: Event;
  relatedEvents: Event[] = [];
  currentImageIndex: number = 0;

  constructor(private eventService: EventService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const eventId = params['id'];
      this.fetchEventDetails(eventId);
      this.fetchRelatedEvents(eventId);
    });
  }

  fetchEventDetails(eventId: string): void {
    this.eventService.getEventById(eventId).subscribe((data: Event) => {
      this.event = data;
    });
  }

  fetchRelatedEvents(eventId: string): void {
    this.eventService.getRelatedEvents(eventId).subscribe((data: Event[]) => {
      this.relatedEvents = data;
    });
  }

  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      // this.currentImageIndex = this.event.images.length - 1;
    }
  }

  nextImage(): void {
    // if (this.currentImageIndex < this.event.images.length - 1) {
    //   this.currentImageIndex++;
    // } else {
    //   this.currentImageIndex = 0;
    // }
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  bookTickets(): void {
    // Implement ticket booking logic here
    alert('Tickets booked successfully!');
  }
}
