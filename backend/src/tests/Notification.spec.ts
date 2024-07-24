import createError from 'http-errors';
import prisma from '../config/Prisma.config';
import NotificationService from '../services/Notification.service';

jest.mock('../config/Prisma.config');
jest.mock('http-errors');

const notificationService = new NotificationService();

describe('NotificationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllNotifications', () => {
        it('should return all notifications', async () => {
            const notifications = [{ id: '1', type: 'info', message: 'Test notification', read: false, created_at: new Date(), user: { id: '1', username: 'user1' } }];
            (prisma.notification.findMany as jest.Mock).mockResolvedValue(notifications);

            const result = await notificationService.getAllNotifications();

            expect(result).toEqual(notifications);
        });

        it('should throw a 404 error if no notifications are found', async () => {
            (prisma.notification.findMany as jest.Mock).mockResolvedValue([]);

            await expect(notificationService.getAllNotifications()).rejects.toThrow(createError(404, 'No notifications found'));
        });
    });

    describe('getNotificationById', () => {
        it('should return a notification by ID', async () => {
            const notification = { id: '1', type: 'info', message: 'Test notification', read: false, created_at: new Date(), user: { id: '1', username: 'user1' } };
            (prisma.notification.findFirst as jest.Mock).mockResolvedValue(notification);

            const result = await notificationService.getNotificationById('1');

            expect(result).toEqual(notification);
        });

        it('should throw a 404 error if the notification is not found', async () => {
            (prisma.notification.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(notificationService.getNotificationById('1')).rejects.toThrow(createError(404, 'Notification not found'));
        });
    });

    describe('createNotification', () => {
        it('should create a new notification', async () => {
            const user = { id: '1', is_deleted: false, is_suspended: false };
            const newNotification = { id: '1', type: 'info', message: 'New notification', read: false, created_at: new Date(), user: { id: '1', username: 'user1' } };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.notification.create as jest.Mock).mockResolvedValue(newNotification);

            const result = await notificationService.createNotification('1', { type: 'info', message: 'New notification', read: false, created_at: new Date(), user_id: '1', is_deleted: false });

            expect(result).toEqual(newNotification);
        });

        it('should throw a 404 error if the user is not found', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(notificationService.createNotification('1', { type: 'info', message: 'New notification', read: false, created_at: new Date(), user_id: '1', is_deleted: false })).rejects.toThrow(createError(404, 'User not found'));
        });

        it('should throw a 404 error if the user is deleted or suspended', async () => {
            const user = { id: '1', is_deleted: true, is_suspended: false };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

            await expect(notificationService.createNotification('1', { type: 'info', message: 'New notification', read: false, created_at: new Date(), user_id: '1', is_deleted: false })).rejects.toThrow(createError(404, 'User not found'));
        });
    });

    describe('deleteNotification', () => {
        it('should delete a notification', async () => {
            const notification = { id: '1', is_deleted: false };
            (prisma.notification.findUnique as jest.Mock).mockResolvedValue(notification);
            (prisma.notification.update as jest.Mock).mockResolvedValue({ ...notification, is_deleted: true });

            await notificationService.deleteNotification('1');

            expect(prisma.notification.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: { is_deleted: true },
            });
        });

        it('should throw a 404 error if the notification is not found', async () => {
            (prisma.notification.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(notificationService.deleteNotification('1')).rejects.toThrow(createError(404, 'Notification not found'));
        });

        it('should throw a 404 error if the notification is already deleted', async () => {
            const notification = { id: '1', is_deleted: true };
            (prisma.notification.findUnique as jest.Mock).mockResolvedValue(notification);

            await expect(notificationService.deleteNotification('1')).rejects.toThrow(createError(404, 'Notification not found'));
        });
    });

    describe('getNotificationsByUserId', () => {
        it('should return notifications for a user', async () => {
            const notifications = [{ id: '1', type: 'info', message: 'User notification', read: false, created_at: new Date(), user: { id: '1', username: 'user1' } }];
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', is_deleted: false, is_suspended: false });
            (prisma.notification.findMany as jest.Mock).mockResolvedValue(notifications);

            const result = await notificationService.getNotificationsByUserId('1');

            expect(result).toEqual(notifications);
        });

        it('should throw a 404 error if the user is not found', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(notificationService.getNotificationsByUserId('1')).rejects.toThrow(createError(404, 'User not found'));
        });

        it('should throw a 404 error if the user is deleted or suspended', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', is_deleted: true, is_suspended: false });

            await expect(notificationService.getNotificationsByUserId('1')).rejects.toThrow(createError(404, 'User not found'));
        });

        it('should throw a 404 error if no notifications are found for the user', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', is_deleted: false, is_suspended: false });
            (prisma.notification.findMany as jest.Mock).mockResolvedValue([]);

            await expect(notificationService.getNotificationsByUserId('1')).rejects.toThrow(createError(404, 'No notifications found'));
        });
    });

    describe('getUnreadNotificationsByUserId', () => {
        it('should return unread notifications for a user', async () => {
            const notifications = [{ id: '1', type: 'info', message: 'Unread notification', read: false, created_at: new Date(), user: { id: '1', username: 'user1' } }];
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', is_deleted: false, is_suspended: false });
            (prisma.notification.findMany as jest.Mock).mockResolvedValue(notifications);

            const result = await notificationService.getUnreadNotificationsByUserId('1');

            expect(result).toEqual(notifications);
        });

        it('should throw a 404 error if the user is not found', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(notificationService.getUnreadNotificationsByUserId('1')).rejects.toThrow(createError(404, 'User not found'));
        });

        it('should throw a 404 error if the user is deleted or suspended', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', is_deleted: true, is_suspended: false });

            await expect(notificationService.getUnreadNotificationsByUserId('1')).rejects.toThrow(createError(404, 'User not found'));
        });

        it('should throw a 404 error if no unread notifications are found for the user', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', is_deleted: false, is_suspended: false });
            (prisma.notification.findMany as jest.Mock).mockResolvedValue([]);

            await expect(notificationService.getUnreadNotificationsByUserId('1')).rejects.toThrow(createError(404, 'No notifications found'));
        });
    });

    describe('markNotificationAsRead', () => {
        it('should mark a notification as read', async () => {
            const notification = { id: '1', read: false };
            (prisma.notification.findUnique as jest.Mock).mockResolvedValue(notification);
            (prisma.notification.update as jest.Mock).mockResolvedValue({ ...notification, read: true });

            await notificationService.markNotificationAsRead('1');

            expect(prisma.notification.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: { read: true },
            });
        });

        it('should throw a 404 error if the notification is not found', async () => {
            (prisma.notification.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(notificationService.markNotificationAsRead('1')).rejects.toThrow(createError(404, 'Notification not found'));
        });

        it('should throw a 404 error if the notification is deleted', async () => {
            const notification = { id: '1', is_deleted: true };
            (prisma.notification.findUnique as jest.Mock).mockResolvedValue(notification);

            await expect(notificationService.markNotificationAsRead('1')).rejects.toThrow(createError(404, 'Notification not found'));
        });
    });

    describe('getNotificationAnalytics', () => {
        it('should return notification analytics', async () => {
            (prisma.notification.count as jest.Mock).mockImplementation(({ where }) => {
                if (where?.is_deleted === false) return 10;
                if (where?.read === true) return 5;
                if (where?.read === false) return 5;
                return 15;
            });

            const result = await notificationService.getNotificationAnalytics();

            expect(result).toEqual({
                all_notifications: 15,
                active_notifications: 10,
                read_notifications: 5,
                unread_notifications: 5,
                deleted_notifications: 5,
            });
        });
    });
});
