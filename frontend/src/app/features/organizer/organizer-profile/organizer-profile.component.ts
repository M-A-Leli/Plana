import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../../core/services/users.service';
import { OrganizerService } from '../../../core/services/organizer.service';
import Organizer from '../../../shared/models/Organizer';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-organizer-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organizer-profile.component.html',
  styleUrl: './organizer-profile.component.css'
})
export class OrganizerProfileComponent {
  organizer!: Organizer;
  viewMode: 'default' | 'change-profile-picture' | 'edit-profile' | 'change-password' | 'delete-account' = 'default';
  errorMessage: string = '';
  successMessage: string = '';
  newProfile: any = {
    username: '',
    email: '',
    company: '',
    bio: ''
  }
  passwords: any = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  }
  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;

  constructor(private organizerService: OrganizerService, private userService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.fetchOrganizerProfile();
  }

  fetchOrganizerProfile() {
    this.organizerService.getOrganizerProfile().subscribe({
      next: (organizer) => {
        this.organizer = organizer;
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

  showDeleteAccount(): void {
    this.viewMode = 'delete-account';
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
    this.organizerService.updateOrganizerProfile(this.newProfile).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.resetView();
        this.fetchOrganizerProfile();
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

  deleteAccount(): void {
    this.organizerService.deleteOrganizer().subscribe({
      next: () => {
        this.successMessage = 'Account deleted successfully!';
        this.resetView();
        this.clearMessages();
        this.navigateToLogin();
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
          this.fetchOrganizerProfile();
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
