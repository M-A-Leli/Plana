import express from 'express';
import AdminRoutes from './Admin.routes';
import AttendeeRoutes from './Attendee.routes';
import AuthRoutes from './Auth.routes';
import CategoryRoutes from './Category.routes';
import EventRoutes from './Event.routes';
import NotificationRoutes from './Notification.routes';
import OrderRoutes from './Order.routes';
import OrganizerRoutes from './Organizer.routes';
import PasswordResetRoutes from './PasswordReset.routes';
import ReviewRoutes from './Review.routes';
import TicketRoutes from './Ticket.routes';
import TicketTypeRoutes from './TicketType.routes';
import UserRoutes from './User.routes';

const router = express.Router();

// Mount routes
router.use('/admins', AdminRoutes);
router.use('/attendees', AttendeeRoutes);
router.use('/auth', AuthRoutes);
router.use('/categories', CategoryRoutes);
router.use('/events', EventRoutes);
router.use('/notifications', NotificationRoutes);
router.use('/orders', OrderRoutes);
router.use('/organizers', OrganizerRoutes);
router.use('/password-reset', PasswordResetRoutes);
router.use('/reviews', ReviewRoutes);
router.use('/tickets', TicketRoutes);
router.use('/ticket-types', TicketTypeRoutes);
router.use('/users', UserRoutes);

export default router;
