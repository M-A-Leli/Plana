import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-organizer-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organizer-sidebar.component.html',
  styleUrl: './organizer-sidebar.component.css'
})
export class OrganizerSidebarComponent {
  isCollapsed = false;
  selectedItem: NavItem | null = null;

  mainNavItems: NavItem[] = [
    { label: 'dashboard', icon: '/icons/dashboard.png', route: '/organizer/dashboard' },
    { label: 'events', icon: '/icons/event.png', route: '/organizer/events' },
    { label: 'attendees', icon: '/icons/users.png', route: '/organizer/attendees' },
    { label: 'messages', icon: '/icons/message.png', route: '/organizer/messages' },
  ];

  secondaryNavItems: NavItem[] = [
    { label: 'settings', icon: '/icons/settings.png', route: '/organizer/settings' },
    { label: 'logout', icon: '/icons/logout.png', route: '/organizer/logout' },
  ];

  constructor(private router: Router) { }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  navigate(route: string): void {
    const foundItem = this.mainNavItems.concat(this.secondaryNavItems).find(item => item.route === route);
    this.selectedItem = foundItem ? foundItem : null;
    this.router.navigate([route]);
  }
}
