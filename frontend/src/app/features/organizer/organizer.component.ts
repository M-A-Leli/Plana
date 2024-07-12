import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrganizerSidebarComponent } from './organizer-sidebar/organizer-sidebar.component';
import { OrganizerTopbarComponent } from './organizer-topbar/organizer-topbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organizer',
  standalone: true,
  imports: [RouterOutlet, OrganizerSidebarComponent, OrganizerTopbarComponent, CommonModule],
  templateUrl: './organizer.component.html',
  styleUrl: './organizer.component.css'
})
export class OrganizerComponent {
  isSidebarCollapsed = false;

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
