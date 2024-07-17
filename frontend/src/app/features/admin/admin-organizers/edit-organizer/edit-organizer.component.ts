import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizerService } from '../../../../core/services/organizer.service';
import Organizer from '../../../../shared/models/Organizer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-organizer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-organizer.component.html',
  styleUrl: './edit-organizer.component.css'
})
export class EditOrganizerComponent {
  editForm: FormGroup;
  message: string | null = null;
  isError: boolean = false;

  @Input() organizerId: string | null = null;
  @Output() cancel = new EventEmitter<void>();

  organizer: Organizer | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private organizerService: OrganizerService
  ) {
    this.editForm = this.fb.group({
      company: ['', Validators.required],
      bio: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      profile_img: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadOrganizerData();
  }

  private loadOrganizerData(): void {
    if (this.organizerId) {
      this.organizerService.getOrganizerById(this.organizerId).subscribe(
        organizer => {
          this.organizer = organizer;
          this.editForm.patchValue({
            company: organizer.company,
            bio: organizer.bio,
            username: organizer.user?.username,
            email: organizer.user?.email,
            profile_img: organizer.user?.profile_img
          });
        },
        error => {
          console.error('Failed to fetch organizer', error);
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

    const updatedOrganizer: Organizer = {
      id: this.organizerId || '',
      company: this.editForm.value.company,
      bio: this.editForm.value.bio,
      user: {
        id: this.organizer?.user?.id || '',  // Adjust as needed
        username: this.editForm.value.username,
        email: this.editForm.value.email,
        profile_img: this.editForm.value.profile_img
      }
    };

    this.organizerService.updateOrganizer(updatedOrganizer.id as string, updatedOrganizer).subscribe(
      response => {
        this.message = 'Organizer updated successfully!';
        this.isError = false;
        this.cancel.emit(); // Emit cancel event to go back to the default view
      },
      error => {
        this.message = 'Failed to update organizer. Please try again.';
        this.isError = true;
      }
    );
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
