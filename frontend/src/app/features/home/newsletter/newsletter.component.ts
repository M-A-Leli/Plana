import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css'
})
export class NewsletterComponent {
  email: string = '';

  subscribe() {
    if (this.email) {
      alert(`Subscribed with email: ${this.email}`);
      // Implement actual subscription logic here
      this.email = '';
    } else {
      alert('Please enter a valid email address.');
    }
  }
}
