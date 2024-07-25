import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-attendee-logout',
  standalone: true,
  imports: [],
  templateUrl: './attendee-logout.component.html',
  styleUrl: './attendee-logout.component.css'
})
export class AttendeeLogoutComponent {
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
