import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { OrganizerSidebarComponent } from './organizer-sidebar/organizer-sidebar.component';
import { OrganizerTopbarComponent } from './organizer-topbar/organizer-topbar.component';
import { OrganizerCalendarComponent } from './organizer-calendar/organizer-calendar.component';
import { CommonModule } from '@angular/common';
import { OrganizerDashboardComponent } from './organizer-dashboard/organizer-dashboard.component';
import { OrganizerEventsComponent } from './organizer-events/organizer-events.component';
import { OrganizerLogoutComponent } from './organizer-logout/organizer-logout.component';
import { OrganizerMessagesComponent } from './organizer-messages/organizer-messages.component';
import { OrganizerProfileComponent } from './organizer-profile/organizer-profile.component';

@Component({
  selector: 'app-organizer',
  standalone: true,
  imports: [CommonModule, OrganizerSidebarComponent, OrganizerTopbarComponent, OrganizerCalendarComponent, OrganizerDashboardComponent, OrganizerEventsComponent, OrganizerLogoutComponent, OrganizerMessagesComponent, OrganizerProfileComponent],
  templateUrl: './organizer.component.html',
  styleUrl: './organizer.component.css'
})
export class OrganizerComponent {
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
