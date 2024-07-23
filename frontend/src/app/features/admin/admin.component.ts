import { Component } from '@angular/core';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from './admin-topbar/admin-topbar.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminAdminsComponent } from './admin-admins/admin-admins.component';
import { AdminAttendeesComponent } from './admin-attendees/admin-attendees.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminEventsComponent } from './admin-events/admin-events.component';
import { AdminLogoutComponent } from './admin-logout/admin-logout.component';
import { AdminNotificationsComponent } from './admin-notifications/admin-notifications.component';
import { AdminOrganizersComponent } from './admin-organizers/admin-organizers.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminCategoriesComponent } from './admin-categories/admin-categories.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent, AdminTopbarComponent, AdminAdminsComponent, AdminAttendeesComponent, AdminDashboardComponent, AdminEventsComponent, AdminLogoutComponent, AdminNotificationsComponent, AdminOrganizersComponent, AdminProfileComponent, AdminUsersComponent, AdminCategoriesComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  isSidebarCollapsed = false;
  currentRoute: string | undefined;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.router.url.split('/').pop();
      }
    });
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url.split('/').pop();
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
