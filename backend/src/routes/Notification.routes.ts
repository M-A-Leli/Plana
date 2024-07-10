import { Router } from 'express';
import NotificationController from '../controllers/Notification.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

//! Apply AuthMiddleware to all routes that require authentication
// router.use(AuthMiddleware.authorizeUser);

router.get('/user', NotificationController.getNotificationsByUserId); // Get user's notifications
router.get('/user/unread', NotificationController.getUnreadNotificationsByUserId); // Get user's unread notifications
router.get('/', AuthMiddleware.authorizeAdmin, NotificationController.getAllNotifications); // Get all notifications (Admin only)
router.post('/', AuthMiddleware.authorizeAdmin, NotificationController.createNotification); // Create notification (Admin only)
router.get('/:id', NotificationController.getNotificationById); // Get notification by id
router.delete('/:id', AuthMiddleware.authorizeAdmin, NotificationController.deleteNotification); // Delete notification (Admin only)
router.patch('/mark-as-read/:id', NotificationController.markNotificationAsRead); // Mark notification as read

export default router;
