import { Component } from '@angular/core';
import Admin from '../../../shared/models/Admin';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../core/services/users.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-admins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-admins.component.html',
  styleUrl: './admin-admins.component.css'
})
export class AdminAdminsComponent {
  admins: Admin[] = [];
  paginatedAdmins: Admin[] = [];
  selectedAdmin: Admin | null = null;
  newAdmin = { username: '', email: '' };
  viewMode: 'default' | 'view' | 'create' | 'edit' | 'suspend' | 'reinstate' | 'delete' = 'default';
  currentPage: number = 1;
  adminsPerPage: number = 10;
  totalPages: number = 1;
  errorMessage: string = '';
  successMessage: string = '';

  analytics: any = {
    all_admins: 0,
    active_admins: 0,
    deleted_admins: 0,
    approved_admins: 0
  };

  constructor(private adminService: AdminService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.fetchAdmins();
    this.fetchAnalytics();
  }

  fetchAdmins(): void {
    this.adminService.getAllAdmins().subscribe(admins => {
      this.admins = admins;
      this.totalPages = Math.ceil(this.admins.length / this.adminsPerPage);
      this.updatePaginatedAdmins();
    });
  }

  fetchAnalytics(): void {
    this.adminService.getAdminAnalytics().subscribe(analytics => {
      this.analytics = analytics;
    });
  }

  filterAdmins(type: 'all' | 'active' | 'suspended' | 'deleted'): void {
    switch (type) {
      case 'all':
        this.adminService.getAllAdmins().subscribe(admins => {
          this.admins = admins;
          this.totalPages = Math.ceil(this.admins.length / this.adminsPerPage);
          this.updatePaginatedAdmins();
        });
        break;
      case 'active':
        this.adminService.getActiveAdmins().subscribe(admins => {
          this.admins = admins;
          this.totalPages = Math.ceil(this.admins.length / this.adminsPerPage);
          this.updatePaginatedAdmins();
        });
        break;
      case 'suspended':
        this.adminService.getSuspendedAdmins().subscribe(admins => {
          this.admins = admins;
          this.totalPages = Math.ceil(this.admins.length / this.adminsPerPage);
          this.updatePaginatedAdmins();
        });
        break;
      case 'deleted':
        this.adminService.getDeletedAdmins().subscribe(admins => {
          this.admins = admins;
          this.totalPages = Math.ceil(this.admins.length / this.adminsPerPage);
          this.updatePaginatedAdmins();
        });
        break;
    }
  }

  updatePaginatedAdmins(): void {
    const start = (this.currentPage - 1) * this.adminsPerPage;
    const end = start + this.adminsPerPage;
    this.paginatedAdmins = this.admins.slice(start, end);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedAdmins();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedAdmins();
    }
  }

  getAdminStatus(admin: Admin): string {
    if (admin.is_deleted) return 'Deleted';
    if (admin.user?.is_suspended) return 'Suspended';
    return 'Active';
  }

  showView(admin: Admin): void {
    this.selectedAdmin = admin;
    this.viewMode = 'view';
  }

  showEdit(admin: Admin): void {
    this.selectedAdmin = admin;
    this.viewMode = 'edit';
  }

  showCreate(): void {
    this.selectedAdmin = null;
    this.viewMode = 'create';
  }

  showDelete(admin: Admin): void {
    this.selectedAdmin = admin;
    this.viewMode = 'delete';
  }

  showSuspend(admin: Admin): void {
    this.selectedAdmin = admin;
    this.viewMode = 'suspend';
  }

  showReinstate(admin: Admin): void {
    this.selectedAdmin = admin;
    this.viewMode = 'reinstate';
  }

  resetView(): void {
    this.selectedAdmin = null;
    this.viewMode = 'default';
  }

  clearErrors() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  createAdmin(): void {
    if (this.newAdmin.username && this.newAdmin.email) {
      this.adminService.createAdmin(this.newAdmin).subscribe({
        next: data => {
          this.successMessage = 'Admin created successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchAdmins();
            this.fetchAnalytics();
            this.resetView();
          }, 3000);
        },
        error: err => {
          if (err.status === 401 || err.status === 404 || err.status === 409 || err.status === 400) {
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

  updateAdmin(): void {
    if (this.selectedAdmin && this.selectedAdmin.user?.username && this.selectedAdmin.user?.email) {
      this.adminService.updateAdmin(this.selectedAdmin.id as string, this.selectedAdmin).subscribe({
        next: data => {
          this.successMessage = 'Admin updated successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchAdmins();
            this.fetchAnalytics();
            this.resetView();
          }, 3000);
        },
        error: err => {
          if (err.status === 401 || err.status === 404 || err.status === 409 || err.status === 400 || err.status === 403) {
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

  deleteAdmin(): void {
    if (this.selectedAdmin) {
      this.adminService.deleteAdmin(this.selectedAdmin.id as string).subscribe({
        next: data => {
          this.successMessage = 'Admin deleted successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchAdmins();
            this.fetchAnalytics();
            this.resetView();
          }, 3000);
        },
        error: err => {
          if (err.status === 401 || err.status === 404 || err.status === 400 || err.status === 403) {
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

  suspendAdmin(): void {
    if (this.selectedAdmin) {
      this.usersService.suspendUser(this.selectedAdmin.user?.id as string).subscribe({
        next: data => {
          this.successMessage = 'Admin suspended successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchAdmins();
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

  reinstateAdmin(): void {
    if (this.selectedAdmin) {
      this.usersService.reinstateUser(this.selectedAdmin.user?.id as string).subscribe({
        next: data => {
          this.successMessage = 'Admin reinstated successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchAdmins();
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
