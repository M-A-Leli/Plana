import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {
  isCollapsed = false;
  selectedItem: NavItem | null = null;

  mainNavItems: NavItem[] = [
    { label: 'dashboard', icon: '/icons/dashboard.png', route: '/admin/dashboard' },
    { label: 'admins', icon: '/icons/admins.png', route: '/admin/admins' },
    { label: 'organizers', icon: '/icons/organizers.png', route: '/admin/organizers' },
    { label: 'attendees', icon: '/icons/attendees.png', route: '/admin/attendees' },
    { label: 'users', icon: '/icons/users.png', route: '/admin/users' },
    { label: 'events', icon: '/icons/event.png', route: '/admin/events' },
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
