import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';
import Event from '../../../shared/models/Event';

interface Day {
  date: Date | null;
  events: Event[];
}

@Component({
  selector: 'app-attendee-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendee-calendar.component.html',
  styleUrl: './attendee-calendar.component.css'
})
export class AttendeeCalendarComponent {
  events: Event[] = [];
  currentMonthYear!: string;
  today: string;
  days: Day[] = [];
  showModal: boolean = false;
  selectedDay!: Day;
  selectedMonth: string;
  selectedYear: number;
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  dayNames: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(private eventService: EventService) {
    const today = new Date();
    this.selectedMonth = this.months[today.getMonth()];
    this.selectedYear = today.getFullYear();
    this.today = today.toDateString();
    this.updateCurrentMonthYear();
  }

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    // !
    // this.eventService.getOrganizersEvents().subscribe(events => {
      // this.events = events;
      this.generateCalendar();
    // });
  }

  updateCurrentMonthYear() {
    this.currentMonthYear = `${this.selectedMonth} ${this.selectedYear}`;
  }

  generateCalendar() {
    const date = new Date(this.selectedYear, this.months.indexOf(this.selectedMonth), 1);
    const firstDay = date.getDay();
    const lastDate = new Date(this.selectedYear, this.months.indexOf(this.selectedMonth) + 1, 0).getDate();
    this.days = [];
    // Add empty days for previous month's days to align the first day of the month correctly
    for (let i = 0; i < firstDay; i++) {
      this.days.push({ date: null, events: [] });
    }
    // Add days for the current month with their corresponding events
    for (let i = 1; i <= lastDate; i++) {
      this.days.push({
        date: new Date(this.selectedYear, this.months.indexOf(this.selectedMonth), i),
        events: this.getEventsForDate(i)
      });
    }
  }

  getEventsForDate(date: number): Event[] {
    const selectedDate = new Date(this.selectedYear, this.months.indexOf(this.selectedMonth), date);
    return this.events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === selectedDate.getFullYear() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getDate() === selectedDate.getDate()
      );
    });
  }

  prevMonth() {
    const currentIndex = this.months.indexOf(this.selectedMonth);
    if (currentIndex === 0) {
      this.selectedMonth = this.months[11];
      this.selectedYear--;
    } else {
      this.selectedMonth = this.months[currentIndex - 1];
    }
    this.updateCurrentMonthYear();
    this.generateCalendar();
  }

  nextMonth() {
    const currentIndex = this.months.indexOf(this.selectedMonth);
    if (currentIndex === 11) {
      this.selectedMonth = this.months[0];
      this.selectedYear++;
    } else {
      this.selectedMonth = this.months[currentIndex + 1];
    }
    this.updateCurrentMonthYear();
    this.generateCalendar();
  }

  jumpToDate() {
    this.updateCurrentMonthYear();
    this.generateCalendar();
  }

  openModal(day: Day) {
    if (day.events.length > 0) {
      this.selectedDay = day;
      this.showModal = true;
    }
  }

  closeModal() {
    this.showModal = false;
  }
}
