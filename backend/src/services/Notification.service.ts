import { Prisma, Notification } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../config/Prisma.config';

class NotificationService {
    async getAllNotifications(): Promise<Partial<Notification>[]> {
        const notifications = await prisma.notification.findMany({
            where: { is_deleted: false },
            select: {
                id: true,
                type: true,
                message: true,
                read: true,
                created_at: true,
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        if (notifications.length === 0) {
            throw createError(404, 'No notifications found');
        }

        return notifications;
    }

    async getNotificationById(id: string): Promise<Partial<Notification>> {
        const notification = await prisma.notification.findFirst({
            where: { id, is_deleted: false },
            select: {
                id: true,
                type: true,
                message: true,
                read: true,
                created_at: true,
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        if (!notification) {
            throw createError(404, 'Notification not found');
        }

        return notification;
    }

    async createNotification(data: Omit<Notification, 'id'>): Promise<Partial<Notification>> {
        const user = await prisma.user.findUnique({
            where: {
                id: data.user_id
            }
        });

        if (!user || user.is_deleted) {
            throw createError(404, 'user not found');
        }

        const newNotification = await prisma.notification.create({
            data,
            select: {
                id: true,
                type: true,
                message: true,
                read: true,
                created_at: true,
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        return newNotification;
    }

    async deleteNotification(id: string): Promise<void> {
        const notification = await prisma.notification.findUnique({
            where: { id },
        });

        if (!notification || notification.is_deleted) {
            throw createError(404, 'Notification not found');
        }

        await prisma.notification.update({
            where: { id },
            data: { is_deleted: true },
        });
    }

    async getNotificationsByUserId(id: string): Promise<Partial<Notification>[]> {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user || user.is_deleted) {
            throw createError(404, 'User not found');
        }

        const notifications = await prisma.notification.findMany({
            where: { user_id: id, is_deleted: false },
            select: {
                id: true,
                type: true,
                message: true,
                read: true,
                created_at: true,
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        if (notifications.length === 0) {
            throw createError(404, 'No notifications found');
        }

        return notifications;
    }

    async getUnreadNotificationsByUserId(id: string): Promise<Partial<Notification>[]> {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user || user.is_deleted) {
            throw createError(404, 'User not found');
        }

        const notifications = await prisma.notification.findMany({
            where: { user_id: id, is_deleted: false, read: false },
            select: {
                id: true,
                type: true,
                message: true,
                read: true,
                created_at: true,
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        if (notifications.length === 0) {
            throw createError(404, 'No notifications found');
        }

        return notifications;
    }

    async markNotificationAsRead(id: string): Promise<void> {
        const notification = await prisma.notification.findUnique({
            where: { id },
        });

        if (!notification || notification.is_deleted) {
            throw createError(404, 'Notification not found');
        }

        await prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }
}

export default NotificationService;
