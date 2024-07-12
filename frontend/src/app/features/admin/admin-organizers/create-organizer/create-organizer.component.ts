import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrganizerService } from '../../../../core/services/organizer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-organizer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-organizer.component.html',
  styleUrl: './create-organizer.component.css'
})
export class CreateOrganizerComponent {
  createOrganizerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private organizerService: OrganizerService) {
    this.createOrganizerForm = this.fb.group({
      company: ['', Validators.required],
      bio: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      profile_img: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.createOrganizerForm.valid) {
      this.organizerService.createOrganizer(this.createOrganizerForm.value).subscribe(
        response => {
          this.successMessage = 'Organizer created successfully!';
          this.errorMessage = '';
          console.log('Organizer created successfully', response);
          // Navigate to default view or success message
        },
        error => {
          this.errorMessage = 'Failed to create organizer.';
          this.successMessage = '';
          console.error('Error creating organizer', error)
        }
      );
    }
  }

  onCancel(): void {
    // Logic to cancel the creation
  }
}
