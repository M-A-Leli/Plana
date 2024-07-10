import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-single-event',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './single-event.component.html',
  styleUrl: './single-event.component.css'
})
export class SingleEventComponent {
  event: Event | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const eventId = params['id'];
      // Fetch event details using eventId
      this.event = this.getEventDetails(eventId);
    });
  }

  getEventDetails(id: string): Event | undefined {
    // Replace this with actual logic to fetch event details
    const events: Event[] = [
      {
        id: '1',
        title: 'Event 1',
        date: '2024-08-01',
        time: '18:00',
        location: 'City Hall',
        description: 'Description of Event 1',
        imageUrl: 'assets/event1.jpg'
      },
      {
        id: '2',
        title: 'Event 2',
        date: '2024-08-15',
        time: '19:00',
        location: 'Convention Center',
        description: 'Description of Event 2',
        imageUrl: 'assets/event2.jpg'
      }
      // Add more events here
    ];
    return events.find(event => event.title === id);
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  bookTickets(): void {
    // Implement ticket booking logic here
    alert('Tickets booked successfully!');
  }
}
