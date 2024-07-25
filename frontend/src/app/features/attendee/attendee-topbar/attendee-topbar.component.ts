import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attendee-topbar',
  standalone: true,
  imports: [],
  templateUrl: './attendee-topbar.component.html',
  styleUrl: './attendee-topbar.component.css'
})
export class AttendeeTopbarComponent {

  constructor(private router: Router) {}

  onSearch(term: string): void {
    console.log('Search term:', term);
    // Implement search logic here
  }
}
