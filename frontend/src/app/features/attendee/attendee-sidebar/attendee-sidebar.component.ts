import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-attendee-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendee-sidebar.component.html',
  styleUrl: './attendee-sidebar.component.css'
})
export class AttendeeSidebarComponent {
  isCollapsed = false;
  selectedItem: NavItem | null = null;

  mainNavItems: NavItem[] = [
    { label: 'dashboard', icon: '/icons/dashboard.png', route: '/attendee/dashboard' },
    { label: 'events', icon: '/icons/event.png', route: '/attendee/events' },
    { label: 'calendar', icon: '/icons/calendar.png', route: '/attendee/calendar' },
    { label: 'messages', icon: '/icons/message.png', route: '/attendee/messages' },
    { label: 'profile', icon: '/icons/profile.png', route: '/attendee/profile' },
    { label: 'logout', icon: '/icons/logout.png', route: '/attendee/logout' },
  ];

  constructor(private router: Router) { }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  navigate(route: string): void {
    const foundItem = this.mainNavItems.find(item => item.route === route);
    this.selectedItem = foundItem ? foundItem : null;
    this.router.navigate([route]);
  }
}
