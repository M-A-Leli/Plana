import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [],
  templateUrl: './admin-topbar.component.html',
  styleUrl: './admin-topbar.component.css'
})
export class AdminTopbarComponent {
  dropdownVisible = false;

  constructor(private router: Router) {}

  onSearch(term: string): void {
    console.log('Search term:', term);
    // Implement search logic here
  }

  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  navigate(route: string): void {
    this.router.navigate([route]);
    this.dropdownVisible = false;  // Close dropdown after navigation
  }
}
