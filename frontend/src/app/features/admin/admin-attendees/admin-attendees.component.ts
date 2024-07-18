import { Component } from '@angular/core';
import Attendee from '../../../shared/models/Attendee';
import { AttendeeService } from '../../../core/services/attendee.service';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-admin-attendees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-attendees.component.html',
  styleUrl: './admin-attendees.component.css'
})
export class AdminAttendeesComponent {

  attendees: Attendee[] = [];
  paginatedAttendees: Attendee[] = [];
  selectedAttendee: Attendee | null = null;
  viewMode: 'default' | 'view' | 'suspend' | 'reinstate' = 'default';
  currentPage: number = 1;
  attendeesPerPage: number = 10;
  totalPages: number = 1;
  errorMessage: string = '';
  successMessage: string = '';

  analytics: any = {
    all_attendees: 0,
    active_attendees: 0,
    deleted_attendees: 0,
    approved_attendees: 0
  };

  constructor(private attendeeService: AttendeeService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.fetchAttendees();
    this.fetchAnalytics();
  }

  fetchAttendees(): void {
    this.attendeeService.getAllAttendees().subscribe(attendees => {
      this.attendees = attendees;
      this.totalPages = Math.ceil(this.attendees.length / this.attendeesPerPage);
      this.updatePaginatedAttendees();
    });
  }

  fetchAnalytics(): void {
    this.attendeeService.getAttendeeAnalytics().subscribe(analytics => {
      this.analytics = analytics;
    });
  }

  filterAttendees(type: 'all' | 'active' | 'suspended' | 'deleted'): void {
    switch (type) {
      case 'all':
        this.attendeeService.getAllAttendees().subscribe(attendees => {
          this.attendees = attendees;
          this.totalPages = Math.ceil(this.attendees.length / this.attendeesPerPage);
          this.updatePaginatedAttendees();
        });
        break;
      case 'active':
        this.attendeeService.getActiveAttendees().subscribe(attendees => {
          this.attendees = attendees;
          this.totalPages = Math.ceil(this.attendees.length / this.attendeesPerPage);
          this.updatePaginatedAttendees();
        });
        break;
      case 'suspended':
        this.attendeeService.getSuspendedAttendees().subscribe(attendees => {
          this.attendees = attendees;
          this.totalPages = Math.ceil(this.attendees.length / this.attendeesPerPage);
          this.updatePaginatedAttendees();
        });
        break;
      case 'deleted':
        this.attendeeService.getDeletedAttendees().subscribe(attendees => {
          this.attendees = attendees;
          this.totalPages = Math.ceil(this.attendees.length / this.attendeesPerPage);
          this.updatePaginatedAttendees();
        });
        break;
    }
  }

  updatePaginatedAttendees(): void {
    const start = (this.currentPage - 1) * this.attendeesPerPage;
    const end = start + this.attendeesPerPage;
    this.paginatedAttendees = this.attendees.slice(start, end);
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

  getAttendeeStatus(attendee: Attendee): string {
    if (attendee.is_deleted) return 'Deleted';
    if (attendee.user?.is_suspended) return 'Suspended';
    return 'Pending';
  }

  showView(attendee: Attendee): void {
    this.selectedAttendee = attendee;
    this.viewMode = 'view';
  }

  showSuspend(attendee: Attendee): void {
    this.selectedAttendee = attendee;
    this.viewMode = 'suspend';
  }

  showReinstate(attendee: Attendee): void {
    this.selectedAttendee = attendee;
    this.viewMode = 'reinstate';
  }

  resetView(): void {
    this.selectedAttendee = null;
    this.viewMode = 'default';
  }

  clearErrors() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  suspendAttendee(): void {
    if (this.selectedAttendee) {
      this.usersService.suspendUser(this.selectedAttendee.user?.id as string).subscribe({
        next: data => {
          this.successMessage = 'Attendee suspended successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchAttendees();
            this.fetchAnalytics();
            this.resetView();
          }, 3000);
        },
        error: err => {
          if (err.status === 401 || err.status === 404 || err.status === 400) {
            this.errorMessage = err.error.error.message;
            this.clearErrors();
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
            this.clearErrors();
          }
        }
      });
    }
  }

  reinstateAttendee(): void {
    if (this.selectedAttendee) {
      this.usersService.reinstateUser(this.selectedAttendee.user?.id as string).subscribe({
        next: data => {
          this.successMessage = 'Attendee reinstated successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchAttendees();
            this.fetchAnalytics();
            this.resetView();
          }, 3000);
        },
        error: err => {
          if (err.status === 401 || err.status === 404 || err.status === 400) {
            this.errorMessage = err.error.error.message;
            this.clearErrors();
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
            this.clearErrors();
          }
        }
      });
    }
  }
}
