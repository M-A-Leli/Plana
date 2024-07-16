import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendeeService } from '../../../../core/services/attendee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-attendee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-attendee.component.html',
  styleUrls: ['./delete-attendee.component.css']
})
export class DeleteAttendeeComponent {
  message: string | null = null;
  isError: boolean = false;

  @Input() attendeeId: string | null = null;
  @Output() cancel = new EventEmitter<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private attendeeService: AttendeeService
  ) {}

  ngOnInit(): void {
    // Initialization logic if needed
  }

  onDelete(): void {
    if (this.attendeeId) {
      this.attendeeService.deleteAttendee(this.attendeeId).subscribe(
        response => {
          this.message = 'Attendee deleted successfully!';
          this.isError = false;
          setTimeout(() => {
            this.cancel.emit();
            this.router.navigate(['/attendees']); // Adjust the route as needed
          }, 2000);
        },
        error => {
          this.message = 'Failed to delete attendee. Please try again.';
          this.isError = true;
        }
      );
    } else {
      const id = this.route.snapshot.paramMap.get('id') || '';
      this.attendeeService.deleteAttendee(id).subscribe(
        response => {
          this.message = 'Attendee deleted successfully!';
          this.isError = false;
          setTimeout(() => {
            this.cancel.emit();
            this.router.navigate(['/attendees']); // Adjust the route as needed
          }, 2000);
        },
        error => {
          this.message = 'Failed to delete attendee. Please try again.';
          this.isError = true;
        }
      );
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.router.navigate(['/attendees']); // Adjust the route as needed
  }
}
