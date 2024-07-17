import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-admin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-admin.component.html',
  styleUrl: './create-admin.component.css'
})
export class CreateAdminComponent {
  createAdminForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    this.createAdminForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      profile_img: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.createAdminForm.valid) {
      this.adminService.createAdmin(this.createAdminForm.value).subscribe(
        response => {
          this.successMessage = 'Admin created successfully!';
          this.errorMessage = '';
          console.log('Admin created successfully', response);
          // Navigate to default view or success message
        },
        error => {
          this.errorMessage = 'Failed to create admin.';
          this.successMessage = '';
          console.error('Error creating admin', error)
        }
      );
    }
  }

  onCancel(): void {
    // Logic to cancel the creation
  }
}
