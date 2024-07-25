import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import Notification from '../../shared/models/Notification';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test for getAllNotifications
  it('should fetch all notifications', () => {
    const dummyNotifications: Notification[] = [
      { user_id: 'user1', message: 'Notification 1' },
      { user_id: 'user2', message: 'Notification 2' }
    ];

    service.getAllNotifications().subscribe(notifications => {
      expect(notifications.length).toBe(2);
      expect(notifications).toEqual(dummyNotifications);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyNotifications);
  });

  // Test for getNotificationById
  it('should fetch a single notification by id', () => {
    const dummyNotification: Notification = { user_id: 'user1', message: 'Notification 1' };

    service.getNotificationById('123').subscribe(notification => {
      expect(notification).toEqual(dummyNotification);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/123`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyNotification);
  });

  // Test for createNotification
  it('should create a new notification', () => {
    const newNotification: Notification = { user_id: 'user1', message: 'Notification 1' };

    service.createNotification(newNotification).subscribe(notification => {
      expect(notification).toEqual(newNotification);
    });

    const req = httpMock.expectOne(service['baseUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newNotification);
    req.flush(newNotification);
  });

  // Test for deleteNotification
  it('should delete a notification', () => {
    service.deleteNotification('123').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/123`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // Test for getNotificationsByUserId
  it('should fetch notifications by user id', () => {
    const dummyNotifications: Notification[] = [
      { user_id: 'user1', message: 'Notification 1' },
      { user_id: 'user1', message: 'Notification 2' }
    ];

    service.getNotificationsByUserId().subscribe(notifications => {
      expect(notifications.length).toBe(2);
      expect(notifications).toEqual(dummyNotifications);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/user`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyNotifications);
  });

  // Test for getUnreadNotificationsByUserId
  it('should fetch unread notifications by user id', () => {
    const dummyNotifications: Notification[] = [
      { user_id: 'user1', message: 'Unread Notification 1' },
      { user_id: 'user1', message: 'Unread Notification 2' }
    ];

    service.getUnreadNotificationsByUserId().subscribe(notifications => {
      expect(notifications.length).toBe(2);
      expect(notifications).toEqual(dummyNotifications);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/user/unread`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyNotifications);
  });

  // Test for markNotificationAsRead
  it('should mark a notification as read', () => {
    service.markNotificationAsRead('123').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/mark-as-read/123`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  // Test for getNotificationAnalytics
  it('should fetch notification analytics', () => {
    const dummyAnalytics = { totalNotifications: 10, unreadNotifications: 2 };

    service.getNotificationAnalytics().subscribe(analytics => {
      expect(analytics).toEqual(dummyAnalytics);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/analytics`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyAnalytics);
  });
});
