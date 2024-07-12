import { Component, Input } from '@angular/core';
import Attendee from '../../../../shared/models/Attendee';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendeeService } from '../../../../core/services/attendee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-attendee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-attendee.component.html',
  styleUrl: './single-attendee.component.css'
})
export class SingleAttendeeComponent {
  @Input() attendeeId: string | null = null;
  attendee: Attendee | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private attendeeService: AttendeeService
  ) {}

  ngOnInit(): void {
    this.loadAttendeeData();
  }

  private loadAttendeeData(): void {
    if (this.attendeeId) {
      this.attendeeService.getAttendeeById(this.attendeeId).subscribe(
        attendee => {
          this.attendee = attendee;
        },
        error => {
          console.error('Failed to fetch attendee', error);
        }
      );
    } else {
      const id = this.route.snapshot.paramMap.get('id') || '';
      if (id) {
        this.attendeeService.getAttendeeById(id).subscribe(
          response => {
            this.attendee = response;
          },
          error => {
            console.error('Failed to fetch attendee', error);
          }
        );
      }
    }
  }

  onBack(): void {
    this.router.navigate(['/admin/attendees']); // Adjust the route as needed
  }
}
