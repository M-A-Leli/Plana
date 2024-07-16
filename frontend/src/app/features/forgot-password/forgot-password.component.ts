import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordResetService } from '../../core/services/password-reset.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private router: Router, private passwordResetService: PasswordResetService) { }

  onSubmit() {
    this.clearErrors();

    if (!this.email) {
      this.errorMessage = 'Please fill all required fields.';
      this.clearErrors();
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Invalid email address.';
      this.clearErrors();
      return;
    }

    this.passwordResetService.sendPasswordResetCode(this.email).subscribe({
      next: data => {
        this.successMessage = 'A password reset code has been sent to your email successfully. Please check your inbox to proceed.';
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/reset-code/verify']);
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

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
