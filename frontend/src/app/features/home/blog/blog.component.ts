import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Event Management Tips',
      excerpt: 'Learn how to manage your events effectively with our top tips.',
      imageUrl: 'event.jpeg'
    },
    {
      id: 2,
      title: 'Upcoming Event Trends',
      excerpt: 'Discover the latest trends in the event industry.',
      imageUrl: 'event.jpeg'
    },
    {
      id: 3,
      title: 'Successful Event Case Studies',
      excerpt: 'Read about some of the most successful events and what made them great.',
      imageUrl: 'event.jpeg'
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
