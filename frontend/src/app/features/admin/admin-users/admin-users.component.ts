import { Component } from '@angular/core';
import { UsersService } from '../../../core/services/users.service';
import User from '../../../shared/models/User';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent {

  users: User[] = [];
  paginatedUsers: User[] = [];
  selectedUser: User | null = null;
  newUser: Partial<User> = { username: '', email: '' };
  viewMode: 'default' | 'view' | 'edit' | 'create' | 'delete' | 'suspend' | 'reinstate' = 'default';
  currentPage: number = 1;
  usersPerPage: number = 10;
  totalPages: number = 1;
  errorMessage: string = '';
  successMessage: string = '';

  analytics: any = {
    all_users: 0,
    active_users: 0,
    deleted_users: 0,
    suspended_users: 0
  };

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchAnalytics();
  }

  fetchUsers(): void {
    this.usersService.getAllUsers().subscribe(users => {
      this.users = users;
      this.totalPages = Math.ceil(this.users.length / this.usersPerPage);
      this.updatePaginatedUsers();
    });
  }

  fetchAnalytics(): void {
    this.usersService.getUserAnalytics().subscribe(analytics => {
      this.analytics = analytics;
    });
  }

  filterUsers(type: 'all' | 'active' | 'suspended' | 'deleted'): void {
    switch (type) {
      case 'all':
        this.usersService.getAllUsers().subscribe(users => {
          this.users = users;
          this.totalPages = Math.ceil(this.users.length / this.usersPerPage);
          this.updatePaginatedUsers();
        });
        break;
      case 'active':
        this.usersService.getActiveUsers().subscribe(users => {
          this.users = users;
          this.totalPages = Math.ceil(this.users.length / this.usersPerPage);
          this.updatePaginatedUsers();
        });
        break;
      case 'suspended':
        this.usersService.getSuspendedUsers().subscribe(users => {
          this.users = users;
          this.totalPages = Math.ceil(this.users.length / this.usersPerPage);
          this.updatePaginatedUsers();
        });
        break;
      case 'deleted':
        this.usersService.getDeletedUsers().subscribe(users => {
          this.users = users;
          this.totalPages = Math.ceil(this.users.length / this.usersPerPage);
          this.updatePaginatedUsers();
        });
        break;
    }
  }

  updatePaginatedUsers(): void {
    const start = (this.currentPage - 1) * this.usersPerPage;
    const end = start + this.usersPerPage;
    this.paginatedUsers = this.users.slice(start, end);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }

  getUserCategory(user: User): string {
    if (user.admin) return 'Admin';
    if (user.organizers) return 'Organizer';
    if (user.attendees) return 'Attendee';
    return 'Unknown';
  }

  getUserStatus(user: User): string {
    if (user.is_deleted) return 'Deleted';
    if (user.is_suspended) return 'Suspended';
    return 'Active';
  }

  showView(user: User): void {
    this.selectedUser = user;
    this.viewMode = 'view';
  }

  showEdit(user: User): void {
    this.selectedUser = user;
    this.viewMode = 'edit';
  }

  showCreate(): void {
    this.selectedUser = null;
    this.viewMode = 'create';
  }

  showDelete(user: User): void {
    this.selectedUser = user;
    this.viewMode = 'delete';
  }

  showSuspend(user: User): void {
    this.selectedUser = user;
    this.viewMode = 'suspend';
  }

  showReinstate(user: User): void {
    this.selectedUser = user;
    this.viewMode = 'reinstate';
  }

  resetView(): void {
    this.selectedUser = null;
    this.viewMode = 'default';
  }

  clearErrors() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  createUser(): void {
    if (this.newUser.username && this.newUser.email) {
      this.usersService.createUser(this.newUser).subscribe({
        next: data => {
          this.successMessage = 'User created successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchUsers();
            this.fetchAnalytics();
            this.resetView();
          }, 3000);
        },
        error: err => {
          if (err.status === 401 || err.status === 404) {
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

  updateUser(): void {
    if (this.selectedUser && this.selectedUser.username && this.selectedUser.email) {
      this.usersService.updateUser(this.selectedUser.id as string, this.selectedUser).subscribe({
        next: data => {
          this.successMessage = 'User updated successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchUsers();
            this.fetchAnalytics();
            this.resetView();
          }, 3000);
        },
        error: err => {
          if (err.status === 401 || err.status === 404 || err.status === 409) {
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

  deleteUser(): void {
    if (this.selectedUser) {
      this.usersService.deleteUser(this.selectedUser.id as string).subscribe({
        next: data => {
          this.successMessage = 'User deleted successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchUsers();
            this.fetchAnalytics();
            this.resetView();
          }, 3000);
        },
        error: err => {
          if (err.status === 401 || err.status === 404) {
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

  suspendUser(): void {
    if (this.selectedUser) {
      this.usersService.suspendUser(this.selectedUser.id as string).subscribe({
        next: data => {
          this.successMessage = 'User suspended successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchUsers();
            this.fetchAnalytics();
            this.resetView();
          }, 3000);
        },
        error: err => {
          if (err.status === 401 || err.status === 404) {
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

  reinstateUser(): void {
    if (this.selectedUser) {
      this.usersService.reinstateUser(this.selectedUser.id as string).subscribe({
        next: data => {
          this.successMessage = 'User reinstated successfull!';
          setTimeout(() => {
            this.successMessage = '';
            this.fetchUsers();
            this.fetchAnalytics();
            this.resetView();
          }, 3000);
        },
        error: err => {
          if (err.status === 401 || err.status === 404) {
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
