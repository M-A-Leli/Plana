import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Attendee from '../../../shared/models/Attendee';
import { AttendeeService } from '../../../core/services/attendee.service';
import { UsersService } from '../../../core/services/users.service';
import { OrganizerService } from '../../../core/services/organizer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attendee-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendee-profile.component.html',
  styleUrl: './attendee-profile.component.css'
})
export class AttendeeProfileComponent {
  attendee: Attendee | undefined;
  viewMode: 'default' | 'change-profile-picture' | 'edit-profile' | 'become-organizer' | 'change-password' | 'delete-account' = 'default';
  errorMessage: string = '';
  successMessage: string = '';
  newProfile: any = {
    username: '',
    email: '',
    bio: ''
  }
  newCompany: any = {
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

  constructor(private attendeeService: AttendeeService, private userService: UsersService,private organizerService: OrganizerService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAttendeeProfile();
  }

  fetchAttendeeProfile() {
    this.attendeeService.getAttendeeProfile().subscribe({
      next: (attendee) => {
        this.attendee = attendee;
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

  showBecomeOrganizer(): void {
    this.viewMode = 'become-organizer';
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
    this.attendeeService.updateAttendeeProfile(this.newProfile).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.resetView();
        this.fetchAttendeeProfile();
        this.clearMessages();
      },
      error: (error) => {
        this.handleError(error);
        this.clearMessages();
      }
    });
  }

  applyOrganizer(): void {
    this.organizerService.createOrganizer(this.newCompany).subscribe({
      next: () => {
        this.successMessage = 'Organizer application submitted!';
        this.resetView();
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
    this.attendeeService.deleteAttendee().subscribe({
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
          this.fetchAttendeeProfile();
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
