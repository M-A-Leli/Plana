import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendeeService } from '../../../../core/services/attendee.service';
import Attendee from '../../../../shared/models/Attendee';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-attendee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-attendee.component.html',
  styleUrl: './edit-attendee.component.css'
})
export class EditAttendeeComponent {
  editForm: FormGroup;
  message: string | null = null;
  isError: boolean = false;

  @Input() attendeeId: string | null = null;
  @Output() cancel = new EventEmitter<void>();

  attendee: Attendee | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private attendeeService: AttendeeService
  ) {
    this.editForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      bio: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      profile_img: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAttendeeData();
  }

  private loadAttendeeData(): void {
    if (this.attendeeId) {
      this.attendeeService.getAttendeeById(this.attendeeId).subscribe(
        attendee => {
          this.attendee = attendee;
          this.editForm.patchValue({
            first_name: attendee.first_name,
            last_name: attendee.last_name,
            bio: attendee.bio,
            username: attendee.user?.username,
            email: attendee.user?.email,
            phone_number: attendee.user?.phone_number,
            profile_img: attendee.user?.profile_img
          });
        },
        error => {
          console.error('Failed to fetch attendee', error);
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

    const updatedAttendee: Attendee = {
      id: this.attendeeId || '',
      first_name: this.editForm.value.first_name,
      last_name: this.editForm.value.last_name,
      bio: this.editForm.value.bio,
      user: {
        id: this.attendee?.user?.id || '',  // Adjust as needed
        username: this.editForm.value.username,
        email: this.editForm.value.email,
        phone_number: this.editForm.value.phone_number,
        profile_img: this.editForm.value.profile_img
      }
    };

    this.attendeeService.updateAttendee(updatedAttendee.id as string, updatedAttendee).subscribe(
      response => {
        this.message = 'Attendee updated successfully!';
        this.isError = false;
        this.cancel.emit(); // Emit cancel event to go back to the default view
      },
      error => {
        this.message = 'Failed to update attendee. Please try again.';
        this.isError = true;
      }
    );
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
