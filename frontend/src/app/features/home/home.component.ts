import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { HeroComponent } from './hero/hero.component';
import { CtaComponent } from './cta/cta.component';
import { FeaturedEventsComponent } from './featured-events/featured-events.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { BlogComponent } from './blog/blog.component';
import { FAQComponent } from './faq/faq.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { PartnersComponent } from './partners/partners.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, HeroComponent, CtaComponent, FeaturedEventsComponent, AboutUsComponent, TestimonialsComponent, BlogComponent, FAQComponent, NewsletterComponent, PartnersComponent, ContactUsComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
