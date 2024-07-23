import { Router } from 'express';
import NotificationController from '../controllers/Notification.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/analytics', AuthMiddleware.authorizeAdmin, NotificationController.getNotificationAnalytics); // Get Notification analytics
router.get('/user', AuthMiddleware.authorizeUser,  NotificationController.getNotificationsByUserId); // Get user's notifications
router.get('/user/unread', AuthMiddleware.authorizeUser,  NotificationController.getUnreadNotificationsByUserId); // Get user's unread notifications
router.get('/', AuthMiddleware.authorizeAdmin, NotificationController.getAllNotifications); // Get all notifications (Admin only)
router.post('/', AuthMiddleware.authorizeUser,  NotificationController.createNotification); // Create notification (Admin only)
router.get('/:id', AuthMiddleware.authorizeUser,  NotificationController.getNotificationById); // Get notification by id
router.delete('/:id', AuthMiddleware.authorizeUser,  NotificationController.deleteNotification); // Delete notification (Admin only)
router.patch('/mark-as-read/:id', AuthMiddleware.authorizeUser,  NotificationController.markNotificationAsRead); // Mark notification as read

export default router;
