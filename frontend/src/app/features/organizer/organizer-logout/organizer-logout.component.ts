import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-organizer-logout',
  standalone: true,
  imports: [],
  templateUrl: './organizer-logout.component.html',
  styleUrl: './organizer-logout.component.css'
})
export class OrganizerLogoutComponent {
  constructor(private authService: AuthService, private router: Router, private location: Location) { }

  cancel(): void {
    this.location.back();
  }

  confirmLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Logout failed', error);
      }
    });
  }
}
