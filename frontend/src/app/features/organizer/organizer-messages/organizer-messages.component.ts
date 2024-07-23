import { Component } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import Notification from '../../../shared/models/Notification';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organizer-messages',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './organizer-messages.component.html',
  styleUrl: './organizer-messages.component.css'
})
export class OrganizerMessagesComponent {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  viewMode: 'compose' | 'view' | 'default' = 'default';

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.notificationService.getAllNotifications().subscribe(
      (notifications) => {
        this.notifications = notifications;
        this.filteredNotifications = notifications;
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );
  }

  showCompose(): void {
    this.viewMode = 'compose';
  }

  filterNotifications(filter: 'all' | 'unread' | 'read'): void {
    if (filter === 'all') {
      this.filteredNotifications = this.notifications;
    } else if (filter === 'unread') {
      this.filteredNotifications = this.notifications.filter(notification => !notification.read);
    } else {
      this.filteredNotifications = this.notifications.filter(notification => notification.read);
    }
  }

  deleteNotification(notificationId: string): void {
    this.notificationService.deleteNotification(notificationId).subscribe(
      () => {
        this.filteredNotifications = this.filteredNotifications.filter(notification => notification.id !== notificationId);
      },
      (error) => {
        console.error('Error deleting message:', error);
      }
    );
  }
}
