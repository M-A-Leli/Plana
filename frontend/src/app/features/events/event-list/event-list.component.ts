import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

interface Event {
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  category: string;
}

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent {
  events: Event[] = [
    {
      title: 'Event 1',
      date: '2024-08-01',
      location: 'City Hall',
      imageUrl: 'assets/event1.jpg',
      category: 'Music'
    },
    {
      title: 'Event 2',
      date: '2024-08-15',
      location: 'Convention Center',
      imageUrl: 'assets/event2.jpg',
      category: 'Tech'
    },
    // Add more events here
  ];
  searchQuery: string = '';
  selectedCategory: string = '';
  categories: string[] = ['Music', 'Tech', 'Sports', 'Arts'];

  constructor() {}

  ngOnInit(): void {}

  filteredEvents(): Event[] {
    return this.events.filter(event => {
      return (
        event.title.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
        (this.selectedCategory ? event.category === this.selectedCategory : true)
      );
    });
  }

  viewEventDetails(event: Event): void {
    // Implement the logic to view event details
    console.log('View details for', event);
  }
}
