import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-featured-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-events.component.html',
  styleUrl: './featured-events.component.css'
})
export class FeaturedEventsComponent {
  events = [
    {
      image: 'assets/images/event1.jpg',
      title: 'Music Concert',
      date: 'July 20, 2024',
      location: 'New York, NY',
      description: 'Join us for an unforgettable night of music and entertainment.'
    },
    {
      image: 'assets/images/event2.jpg',
      title: 'Art Exhibition',
      date: 'August 5, 2024',
      location: 'Los Angeles, CA',
      description: 'Experience the latest in contemporary art from top artists.'
    },
    {
      image: 'assets/images/event3.jpg',
      title: 'Tech Conference',
      date: 'September 15, 2024',
      location: 'San Francisco, CA',
      description: 'Discover the latest advancements in technology and innovation.'
    },
    {
      image: 'assets/images/event4.jpg',
      title: 'Food Festival',
      date: 'October 10, 2024',
      location: 'Chicago, IL',
      description: 'Taste the best dishes from around the world at our food festival.'
    },
    {
      image: 'assets/images/event5.jpg',
      title: 'Film Premiere',
      date: 'November 12, 2024',
      location: 'Hollywood, CA',
      description: 'Be the first to see the newest blockbuster film at our premiere event.'
    },
    {
      image: 'assets/images/event6.jpg',
      title: 'Fashion Show',
      date: 'December 1, 2024',
      location: 'Paris, France',
      description: 'Witness the latest fashion trends from top designers.'
    },
    {
      image: 'assets/images/event7.jpg',
      title: 'Book Fair',
      date: 'January 20, 2025',
      location: 'London, UK',
      description: 'Meet your favorite authors and explore new books at our book fair.'
    },
    {
      image: 'assets/images/event8.jpg',
      title: 'Sports Event',
      date: 'February 18, 2025',
      location: 'Tokyo, Japan',
      description: 'Cheer on your favorite teams at our exciting sports event.'
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
