import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isScrolled: boolean = false;
  menuOpen: boolean = false;
  lastScrollTop: number = 0;
  showAuthButtons = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkCurrentRoute();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const currentScroll = window.pageYOffset;
    this.isScrolled = currentScroll > 100;

    if (currentScroll > this.lastScrollTop) {
      document.querySelector('header')!.style.top = '-100px';
    } else {
      document.querySelector('header')!.style.top = '0';
    }
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  checkCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.showAuthButtons = !['/login', '/register', '/forgot-password', '/reset-code/verify', '/password-reset', '/tickets'].includes(currentUrl);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
