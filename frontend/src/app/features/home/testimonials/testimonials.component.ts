import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  testimonials = [
    {
      // image: '/user1.jpg',
      image: '/profile3.png',
      quote: 'Plana made organizing our annual conference a breeze. The user interface is intuitive and the features are exactly what we needed.',
      name: 'Jane Doe',
      role: 'Event Organizer'
    },
    {
      // image: '/user2.jpg',
      image: '/profile3.png',
      quote: 'I found the perfect events to attend through Plana. Booking tickets was seamless, and I loved the reminders I received.',
      name: 'John Smith',
      role: 'Event Attendee'
    },
    {
      // image: '/user3.jpg',
      image: '/profile3.png',
      quote: 'The analytics and reporting features in Plana helped us track our event\'s success in real-time. Highly recommend it!',
      name: 'Sarah Lee',
      role: 'Event Manager'
    }
  ];

  currentIndex = 0;

  prevSlide() {
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.testimonials.length - 1;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex < this.testimonials.length - 1) ? this.currentIndex + 1 : 0;
  }

}
