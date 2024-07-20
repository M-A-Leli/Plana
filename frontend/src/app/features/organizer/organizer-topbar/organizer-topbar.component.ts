import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organizer-topbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './organizer-topbar.component.html',
  styleUrl: './organizer-topbar.component.css'
})
export class OrganizerTopbarComponent {

  constructor(private router: Router) {}

  onSearch(term: string): void {
    console.log('Search term:', term);
    // Implement search logic here
  }
}
