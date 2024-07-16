import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {
  constructor(private router: Router) { }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
}
