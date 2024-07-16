import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { EventService } from '../../../core/services/event.service';
import Event from '../../../shared/models/Event';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';
  categories: string[] = ['Music', 'Sports', 'Conference', 'Workshop']; // Add relevant categories
  page: number = 1;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.eventService.getAllEvents().subscribe((data: Event[]) => {
      this.events = data;
      this.filteredEvents = data;
    });
  }

  filterEvents(): void {
    this.filteredEvents = this.events.filter(event =>
      (this.selectedCategory === '' || event.category === this.selectedCategory) &&
      (this.searchQuery === '' || event.title.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }

  ngOnChanges(): void {
    this.filterEvents();
  }
}
