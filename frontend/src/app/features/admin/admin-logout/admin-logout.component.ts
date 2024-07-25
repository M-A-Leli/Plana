import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-logout',
  standalone: true,
  imports: [],
  templateUrl: './admin-logout.component.html',
  styleUrl: './admin-logout.component.css'
})
export class AdminLogoutComponent {
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
