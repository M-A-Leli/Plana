import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.pattern(/^[0-9]{10,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  validateForm(): boolean {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.clearMessages();
      return false;
    }

    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.errorMessage = 'Passwords must match.';
      this.clearMessages();
      return false;
    }

    return true;
  }

  onSubmit(): void {
    if (this.validateForm()) {
      // !
      this.userService.createUser(this.registerForm.value).subscribe(
        success => {
          if (success) {
            this.successMessage = 'Registration successful!';
            this.clearMessages();
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          }
        },
        error => {
          this.errorMessage = 'Registration failed. Please try again.';
          this.clearMessages();
          console.error('Registration failed', error);
        }
      );
    }
  }

  clearMessages(): void {
    setTimeout(() => {
      this.errorMessage = null;
      this.successMessage = null;
    }, 3000);
  }
}
