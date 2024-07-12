import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Partner {
  name: string;
  logoUrl: string;
}

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.css'
})
export class PartnersComponent {
  partners: Partner[] = [
    { name: 'Partner 1', logoUrl: 'assets/images/partner1.png' },
    { name: 'Partner 2', logoUrl: 'assets/images/partner2.png' },
    { name: 'Partner 3', logoUrl: 'assets/images/partner3.png' },
    { name: 'Partner 4', logoUrl: 'assets/images/partner4.png' },
    { name: 'Partner 5', logoUrl: 'assets/images/partner5.png' },
    { name: 'Partner 6', logoUrl: 'assets/images/partner6.png' },
  ];

  @ViewChild('carousel') carousel!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startScrolling();
    }
  }

  startScrolling() {
    const carousel = this.carousel.nativeElement;
    const scrollWidth = carousel.scrollWidth;
    const clonesWidth = scrollWidth / 2; // Assuming we duplicate the items once

    let scrollPos = 0;

    const scroll = () => {
      scrollPos += 1; // Adjust the scroll speed here
      if (scrollPos >= clonesWidth) {
        scrollPos = 0;
      }
      carousel.scrollLeft = scrollPos;
      requestAnimationFrame(scroll);
    };

    scroll();
  }
}
