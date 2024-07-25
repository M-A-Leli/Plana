import { Component } from '@angular/core';
import Organizer from '../../../shared/models/Organizer';
import { OrganizerService } from '../../../core/services/organizer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-admin-organizers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-organizers.component.html',
  styleUrl: './admin-organizers.component.css'
})
export class AdminOrganizersComponent {

  organizers: Organizer[] = [];
  paginatedOrganizers: Organizer[] = [];
  selectedOrganizer: Organizer | null = null;
  viewMode: 'default' | 'view' | 'approve' | 'revoke'| 'suspend' | 'reinstate' = 'default';
  currentPage: number = 1;
  organizersPerPage: number = 10;
  totalPages: number = 1;
  errorMessage: string = '';
  successMessage: string = '';

  analytics: any = {
    all_organizers: 0,
    active_organizers: 0,
    deleted_organizers: 0,
    approved_organizers: 0
  };

  constructor(private organizerService: OrganizerService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.fetchOrganizers();
    this.fetchAnalytics();
  }

  fetchOrganizers(): void {
    this.organizerService.getAllOrganizers().subscribe(organizers => {
      this.organizers = organizers;
      this.totalPages = Math.ceil(this.organizers.length / this.organizersPerPage);
      this.updatePaginatedOrganizers();
    });
  }

  fetchAnalytics(): void {
    this.organizerService.getOrganizerAnalytics().subscribe(analytics => {
      this.analytics = analytics;
    });
  }

  filterOrganizers(type: 'all' | 'active' | 'approved' | 'deleted'): void {
    switch (type) {
      case 'all':
        this.organizerService.getAllOrganizers().subscribe(organizers => {
          this.organizers = organizers;
          this.totalPages = Math.ceil(this.organizers.length / this.organizersPerPage);
          this.updatePaginatedOrganizers();
        });
        break;
      case 'active':
        this.organizerService.getActiveOrganizers().subscribe(organizers => {
          this.organizers = organizers;
          this.totalPages = Math.ceil(this.organizers.length / this.organizersPerPage);
          this.updatePaginatedOrganizers();
        });
        break;
      case 'approved':
        this.organizerService.getApprovedOrganizers().subscribe(organizers => {
          this.organizers = organizers;
          this.totalPages = Math.ceil(this.organizers.length / this.organizersPerPage);
          this.updatePaginatedOrganizers();
        });
        break;
      case 'deleted':
        this.organizerService.getDeletedOrganizers().subscribe(organizers => {
          this.organizers = organizers;
          this.totalPages = Math.ceil(this.organizers.length / this.organizersPerPage);
          this.updatePaginatedOrganizers();
        });
        break;
    }
  }

  updatePaginatedOrganizers(): void {
    const start = (this.currentPage - 1) * this.organizersPerPage;
    const end = start + this.organizersPerPage;
    this.paginatedOrganizers = this.organizers.slice(start, end);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedOrganizers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedOrganizers();
    }
  }

  getOrganizerStatus(organizer: Organizer): string {
    if (organizer.is_deleted) return 'Deleted';
    if (organizer.user?.is_suspended) return 'Suspended';
    if (organizer.approved) return 'Approved';
    return 'Pending';
  }

  showView(organizer: Organizer): void {
    this.selectedOrganizer = organizer;
    this.viewMode = 'view';
  }

  showApprove(organizer: Organizer): void {
    this.selectedOrganizer = organizer;
    this.viewMode = 'approve';
  }

  showRevoke(organizer: Organizer): void {
    this.selectedOrganizer = organizer;
    this.viewMode = 'revoke';
  }

  showSuspend(organizer: Organizer): void {
    this.selectedOrganizer = organizer;
    this.viewMode = 'suspend';
  }

  showReinstate(organizer: Organizer): void {
    this.selectedOrganizer = organizer;
    this.viewMode = 'reinstate';
  }

  resetView(): void {
    this.selectedOrganizer = null;
    this.viewMode = 'default';
  }

  clearErrors() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  approveOrganizer(): void {
    if (this.selectedOrganizer) {
      this.organizerService.approveOrganizer(this.selectedOrganizer.id as string).subscribe({
        next: data => {
          this.successMessage = 'Organizer approved successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchOrganizers();
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

  revokeOrganizer(): void {
    if (this.selectedOrganizer) {
      this.organizerService.revokeOrganizer(this.selectedOrganizer.id as string).subscribe({
        next: data => {
          this.successMessage = 'Organizer revoked successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchOrganizers();
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

  suspendOrganizer(): void {
    if (this.selectedOrganizer) {
      this.usersService.suspendUser(this.selectedOrganizer.user?.id as string).subscribe({
        next: data => {
          this.successMessage = 'Organizer suspended successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchOrganizers();
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

  reinstateOrganizer(): void {
    if (this.selectedOrganizer) {
      this.usersService.reinstateUser(this.selectedOrganizer.user?.id as string).subscribe({
        next: data => {
          this.successMessage = 'Organizer reinstated successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchOrganizers();
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
