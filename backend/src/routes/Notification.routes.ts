import { Router } from 'express';
import NotificationController from '../controllers/Notification.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/analytics', NotificationController.getNotificationAnalytics); // Get Notification analytics
router.get('/user', NotificationController.getNotificationsByUserId); // Get user's notifications
router.get('/user/unread', NotificationController.getUnreadNotificationsByUserId); // Get user's unread notifications
router.get('/', NotificationController.getAllNotifications); // Get all notifications (Admin only)
router.post('/', NotificationController.createNotification); // Create notification (Admin only)
router.get('/:id', NotificationController.getNotificationById); // Get notification by id
router.delete('/:id', NotificationController.deleteNotification); // Delete notification (Admin only)
router.patch('/mark-as-read/:id', NotificationController.markNotificationAsRead); // Mark notification as read

export default router;
