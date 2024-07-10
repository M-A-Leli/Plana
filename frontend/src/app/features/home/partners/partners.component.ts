import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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
    { name: 'Partner 1', logoUrl: 'assets/partner1.png' },
    { name: 'Partner 2', logoUrl: 'assets/partner2.png' },
    { name: 'Partner 3', logoUrl: 'assets/partner3.png' },
    { name: 'Partner 4', logoUrl: 'assets/partner4.png' }
  ];

  constructor() {}

  ngOnInit(): void {}
}
