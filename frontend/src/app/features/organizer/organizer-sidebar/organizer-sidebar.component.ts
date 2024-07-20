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
    { label: 'calendar', icon: '/icons/calendar.png', route: '/organizer/calendar' },
    { label: 'messages', icon: '/icons/message.png', route: '/organizer/messages' },
    { label: 'profile', icon: '/icons/profile.png', route: '/organizer/profile' },
    { label: 'logout', icon: '/icons/logout.png', route: '/organizer/logout' },
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
