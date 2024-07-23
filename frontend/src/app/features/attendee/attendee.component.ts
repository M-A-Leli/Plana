import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AttendeeSidebarComponent } from './attendee-sidebar/attendee-sidebar.component';
import { AttendeeTopbarComponent } from './attendee-topbar/attendee-topbar.component';
import { AttendeeCalendarComponent } from './attendee-calendar/attendee-calendar.component';
import { AttendeeDashboardComponent } from './attendee-dashboard/attendee-dashboard.component';
import { AttendeeEventsComponent } from './attendee-events/attendee-events.component';
import { AttendeeLogoutComponent } from './attendee-logout/attendee-logout.component';
import { AttendeeMessagesComponent } from './attendee-messages/attendee-messages.component';
import { AttendeeProfileComponent } from './attendee-profile/attendee-profile.component';

@Component({
  selector: 'app-attendee',
  standalone: true,
  imports: [CommonModule, AttendeeSidebarComponent, AttendeeTopbarComponent, AttendeeCalendarComponent, AttendeeDashboardComponent, AttendeeEventsComponent, AttendeeLogoutComponent, AttendeeMessagesComponent, AttendeeProfileComponent],
  templateUrl: './attendee.component.html',
  styleUrl: './attendee.component.css'
})
export class AttendeeComponent {
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
