import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


interface FAQ {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FAQComponent {
  faqs: FAQ[] = [
    {
      question: 'How can I book a ticket?',
      answer: 'You can book a ticket by browsing our events, selecting the event you are interested in, and following the booking instructions provided.'
    },
    {
      question: 'What is your refund policy?',
      answer: 'Our refund policy varies depending on the event. Please check the specific event details for more information on refunds.'
    },
    {
      question: 'How can I contact support?',
      answer: 'You can contact our support team through the contact form on our website or by emailing us at support@example.com.'
    }
  ];

  activeIndex: number | null = null;

  toggleAccordion(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}
