import { Component } from '@angular/core';
import Attendee from '../../../shared/models/Attendee';
import { AttendeeService } from '../../../core/services/attendee.service';
import { CommonModule } from '@angular/common';
import { CreateAttendeeComponent } from './create-attendee/create-attendee.component';
import { EditAttendeeComponent } from './edit-attendee/edit-attendee.component';
import { SingleAttendeeComponent } from './single-attendee/single-attendee.component';
import { DeleteAttendeeComponent } from './delete-attendee/delete-attendee.component';

@Component({
  selector: 'app-admin-attendees',
  standalone: true,
  imports: [CommonModule, CreateAttendeeComponent, EditAttendeeComponent, SingleAttendeeComponent, DeleteAttendeeComponent],
  templateUrl: './admin-attendees.component.html',
  styleUrl: './admin-attendees.component.css'
})
export class AdminAttendeesComponent {
  attendees: Attendee[] = [];
  paginatedAttendees: Attendee[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  selectedAttendeeId: string | null = null;
  currentView: string = 'default';

  constructor(private attendeeService: AttendeeService) {}

  ngOnInit(): void {
    this.loadAttendees();
  }

  loadAttendees(): void {
    this.attendeeService.getAllAttendees().subscribe((attendees) => {
      this.attendees = attendees;
      this.totalPages = Math.ceil(this.attendees.length / this.itemsPerPage);
      this.updatePaginatedAttendees();
    });
  }

  updatePaginatedAttendees(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAttendees = this.attendees.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedAttendees();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedAttendees();
    }
  }

  onCreate(): void {
    this.currentView = 'create';
  }

  onView(id: string): void {
    this.selectedAttendeeId = id;
    this.currentView = 'view';
  }

  onEdit(id: string): void {
    this.selectedAttendeeId = id;
    this.currentView = 'edit';
  }

  onDelete(id: string): void {
    this.selectedAttendeeId = id;
    this.currentView = 'delete';
  }
}
