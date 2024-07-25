import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import IEvent from '../../../shared/models/Event';
import { CategoryService } from '../../../core/services/category.service';
import Category from '../../../shared/models/Category';
import { AuthService } from '../../../core/services/auth.service';
import { TicketService } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent {

  events: IEvent[] = [];
  paginatedEvents: IEvent[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  filteredEvents: IEvent[] = [];
  categories: Category[] = [];
  selectedCategoryId: string = '';
  searchQuery: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private eventService: EventService, private categoryService: CategoryService, private ticketService: TicketService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadEvents();
    this.loadCategories();
  }

  clearErrors() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  paginateEvents(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEvents = this.filteredEvents.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.filteredEvents.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateEvents();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateEvents();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.paginateEvents();
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
    this.eventService.getUpcomingEvents().subscribe((data: IEvent[]) => {
      this.events = data;
      this.filteredEvents = data;
      this.paginateEvents();
    });
  }

  loadCategories() {
    this.categoryService.getActiveCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });
  }

  filterByCategory() {
    if (this.selectedCategoryId) {
      this.eventService.getEventsByCategoryId(this.selectedCategoryId).subscribe((data: IEvent[]) => {
        this.filteredEvents = data;
        this.currentPage = 1;
        this.paginateEvents();
      });
    } else {
      this.filteredEvents = this.events;
      this.currentPage = 1;
      this.paginateEvents();
    }
  }

  search() {
    this.filteredEvents = this.events.filter((event) =>
      event.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.filterByCategory();
  }

  viewEventDetails(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }

  viewOrganizerEvents(organizerId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/events/organizer', organizerId]);
  }
}
