import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import Admin from '../../../../shared/models/Admin';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-admin.component.html',
  styleUrl: './edit-admin.component.css'
})
export class EditAdminComponent {
  editForm: FormGroup;
  message: string | null = null;
  isError: boolean = false;

  @Input() adminId: string | null = null;
  @Output() cancel = new EventEmitter<void>();

  admin: Admin | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    this.editForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      profile_img: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAdminData();
  }

  private loadAdminData(): void {
    if (this.adminId) {
      this.adminService.getAdminById(this.adminId).subscribe(
        admin => {
          this.admin = admin;
          this.editForm.patchValue({
            username: admin.user?.username,
            email: admin.user?.email,
            profile_img: admin.user?.profile_img
          });
        },
        error => {
          console.error('Failed to fetch admin', error);
        }
      );
    }
  }

  onSave(): void {
    if (this.editForm.invalid) {
      this.message = 'Please fill out all required fields correctly.';
      this.isError = true;
      return;
    }

    const updatedAdmin: Admin = {
      id: this.adminId || '',
      user: {
        id: this.admin?.user?.id || '',  // Adjust as needed
        username: this.editForm.value.username,
        email: this.editForm.value.email,
        profile_img: this.editForm.value.profile_img
      }
    };

    this.adminService.updateAdmin(updatedAdmin.id as string, updatedAdmin).subscribe(
      response => {
        this.message = 'Admin updated successfully!';
        this.isError = false;
        this.cancel.emit(); // Emit cancel event to go back to the default view
      },
      error => {
        this.message = 'Failed to update admin. Please try again.';
        this.isError = true;
      }
    );
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
