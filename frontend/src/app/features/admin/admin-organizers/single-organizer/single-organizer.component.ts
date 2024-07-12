import { Component, Input } from '@angular/core';
import Organizer from '../../../../shared/models/Organizer';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizerService } from '../../../../core/services/organizer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-organizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-organizer.component.html',
  styleUrl: './single-organizer.component.css'
})
export class SingleOrganizerComponent {
  @Input() organizerId: string | null = null;
  organizer: Organizer | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organizerService: OrganizerService
  ) {}

  ngOnInit(): void {
    this.loadOrganizerData();
  }

  private loadOrganizerData(): void {
    if (this.organizerId) {
      this.organizerService.getOrganizerById(this.organizerId).subscribe(
        organizer => {
          this.organizer = organizer;
        },
        error => {
          console.error('Failed to fetch organizer', error);
        }
      );
    } else {
      const id = this.route.snapshot.paramMap.get('id') || '';
      if (id) {
        this.organizerService.getOrganizerById(id).subscribe(
          response => {
            this.organizer = response;
          },
          error => {
            console.error('Failed to fetch organizer', error);
          }
        );
      }
    }
  }

  onBack(): void {
    this.router.navigate(['/admin/organizers']); // Adjust the route as needed
  }
}
