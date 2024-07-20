import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AttendeeSidebarComponent } from './attendee-sidebar/attendee-sidebar.component';
import { AttendeeTopbarComponent } from './attendee-topbar/attendee-topbar.component';

@Component({
  selector: 'app-attendee',
  standalone: true,
  imports: [RouterOutlet, AttendeeSidebarComponent, AttendeeTopbarComponent],
  templateUrl: './attendee.component.html',
  styleUrl: './attendee.component.css'
})
export class AttendeeComponent {
  isSidebarCollapsed = false;

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
