import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizerService } from '../../../../core/services/organizer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-organizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-organizer.component.html',
  styleUrls: ['./delete-organizer.component.css']
})
export class DeleteOrganizerComponent {
  message: string | null = null;
  isError: boolean = false;

  @Input() organizerId: string | null = null;
  @Output() cancel = new EventEmitter<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organizerService: OrganizerService
  ) {}

  ngOnInit(): void {
    // Initialization logic if needed
  }

  onDelete(): void {
    if (this.organizerId) {
      this.organizerService.deleteOrganizer(this.organizerId).subscribe(
        response => {
          this.message = 'Organizer deleted successfully!';
          this.isError = false;
          setTimeout(() => {
            this.cancel.emit();
            this.router.navigate(['/organizers']); // Adjust the route as needed
          }, 2000);
        },
        error => {
          this.message = 'Failed to delete organizer. Please try again.';
          this.isError = true;
        }
      );
    } else {
      const id = this.route.snapshot.paramMap.get('id') || '';
      this.organizerService.deleteOrganizer(id).subscribe(
        response => {
          this.message = 'Organizer deleted successfully!';
          this.isError = false;
          setTimeout(() => {
            this.cancel.emit();
            this.router.navigate(['/organizers']); // Adjust the route as needed
          }, 2000);
        },
        error => {
          this.message = 'Failed to delete organizer. Please try again.';
          this.isError = true;
        }
      );
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.router.navigate(['/organizers']); // Adjust the route as needed
  }
}
