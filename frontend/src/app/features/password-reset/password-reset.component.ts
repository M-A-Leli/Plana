import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordResetService } from '../../core/services/password-reset.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent {
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private router: Router, private passwordResetService: PasswordResetService) { }

  onSubmit() {
    this.clearErrors();

    if (!this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill all required fields.';
      this.clearErrors();
      return;
    }

    if (!this.validatePassword(this.password)) {
      this.errorMessage = 'Invalid password. It must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be between 8 and 16 characters.';
      this.clearErrors();
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.clearErrors();
      return;
    }

    this.passwordResetService.resetPassword(this.password).subscribe({
      next: data => {
        this.successMessage = 'Password reset successful!';
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: err => {
        if (err.status === 404 || err.status === 400) {
          this.errorMessage = err.error.error.message;
          this.clearErrors();
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
          this.clearErrors();
        }
      }
    });
  }

  clearErrors() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,16}$/;
    return passwordRegex.test(password);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
