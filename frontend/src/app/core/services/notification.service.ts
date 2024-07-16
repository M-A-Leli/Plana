import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Notification from '../../shared/models/Notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = 'http://localhost:3000/api/v1/notifications';

  constructor(private http: HttpClient) { }

  getAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.baseUrl);
  }

  getNotificationById(id: string): Observable<Notification> {
    return this.http.get<Notification>(`${this.baseUrl}/${id}`);
  }

  createNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(this.baseUrl, notification);
  }

  deleteNotification(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getNotificationsByUserId(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/user`);
  }

  getUnreadNotificationsByUserId(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/user/unread`);
  }

  markNotificationAsRead(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/mark-as-read/${id}`, null);
  }

  getNotificationAnalytics(): Observable<Object> {
    return this.http.get<Object>(`${this.baseUrl}/analytics`);
  }
}
