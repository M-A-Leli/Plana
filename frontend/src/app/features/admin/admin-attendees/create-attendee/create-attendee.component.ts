import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AttendeeService } from '../../../../core/services/attendee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-attendee',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-attendee.component.html',
  styleUrl: './create-attendee.component.css'
})
export class CreateAttendeeComponent {
  createAttendeeForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private attendeeService: AttendeeService) {
    this.createAttendeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      bio: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      profile_img: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.createAttendeeForm.valid) {
      this.attendeeService.createAttendee(this.createAttendeeForm.value).subscribe(
        response => {
          this.successMessage = 'Attendee created successfully!';
          this.errorMessage = '';
          console.log('Attendee created successfully', response);
          // Navigate to default view or success message
        },
        error => {
          this.errorMessage = 'Failed to create attendee.';
          this.successMessage = '';
          console.error('Error creating attendee', error)
        }
      );
    }
  }

  onCancel(): void {
    // Logic to cancel the creation
  }
}
