import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { UsersService } from '../../../core/services/users.service';
import Admin from '../../../shared/models/Admin';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent {
  admin!: Admin;
  viewMode: 'default' | 'change-profile-picture' | 'edit-profile' | 'change-password' = 'default';
  errorMessage: string = '';
  successMessage: string = '';
  newProfile: any = {
    username: '',
    email: '',
  }
  passwords: any = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  }
  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;

  constructor(private adminService: AdminService, private userService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAdminProfile();
  }

  fetchAdminProfile() {
    this.adminService.getAdminProfile().subscribe({
      next: (admin) => {
        this.admin = admin;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  showChangeProfilePicture(): void {
    this.viewMode = 'change-profile-picture';
  }

  showEditProfile(): void {
    this.viewMode = 'edit-profile';
  }

  showChangePassword(): void {
    this.viewMode = 'change-password';
  }

  resetView(): void {
    this.viewMode = 'default';
  }

  clearMessages() {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 3000);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  updateProfile(): void {
    this.adminService.updateAdminProfile(this.newProfile).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.resetView();
        this.fetchAdminProfile();
        this.clearMessages();
      },
      error: (error) => {
        this.handleError(error);
        this.clearMessages();
      }
    });
  }

  changePassword(): void {
    this.userService.changePassword(this.passwords).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully!';
        this.resetView();
        this.clearMessages();
      },
      error: (error) => {
        this.handleError(error);
        this.clearMessages();
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.previewImage();
  }

  previewImage(): void {
    if (!this.selectedFile) {
      this.imageUrl = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  changeProfilePicture(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.userService.updateUserProfileImage(formData).subscribe({
        next: () => {
          this.successMessage = 'Profile picture updated successfully!';
          this.resetView();
          this.fetchAdminProfile();
          this.clearMessages();
        },
        error: (error) => {
          this.handleError(error);
          this.clearMessages();
        }
      });
    }
  }

  private handleError(error: any): void {
    if (error.status >= 400 && error.status < 500) {
      this.errorMessage = error.error.error.message || 'A client-side error occurred.';
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again later.';
    }
  }
}
