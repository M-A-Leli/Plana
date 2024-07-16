import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { Router } from '@angular/router';
import { PasswordResetService } from '../../core/services/password-reset.service';

@Component({
  selector: 'app-reset-code-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './reset-code-verification.component.html',
  styleUrl: './reset-code-verification.component.css'
})
export class ResetCodeVerificationComponent {
  resetCode: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private router: Router, private passwordResetService: PasswordResetService) { }

  onSubmit(): void {
    this.clearErrors();

    if (!this.resetCode) {
      this.errorMessage = 'Please fill all required fields.';
      this.clearErrors();
      return;
    }

    if (!this.validateResetCode(this.resetCode)) {
      this.errorMessage = 'Invalid reset code.';
      this.clearErrors();
      return;
    }

    this.passwordResetService.verifyPasswordResetCode(this.resetCode).subscribe({
      next: data => {
        this.successMessage = 'Reset code verification successfull!';
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/password-reset']);
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

  validateResetCode(reset_code: string): boolean {
    const resetCodeRegex = /^[a-zA-Z0-9]{6}$/;
    return resetCodeRegex.test(reset_code);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  resendCode(): void {
    this.router.navigate(['/forgot-password']);
  }
}
