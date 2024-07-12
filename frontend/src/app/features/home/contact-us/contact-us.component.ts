import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  contact = {
    name: '',
    email: '',
    message: ''
  };

  constructor() {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.contact.name && this.contact.email && this.contact.message) {
      // Handle the form submission logic here
      console.log('Form submitted', this.contact);
      this.contact = { name: '', email: '', message: '' };
    }
  }
}
