import { Router } from 'express';
import AnalyticsController from '../controllers/Analytics.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/attendee', AuthMiddleware.authorizeAttendee, AnalyticsController.getAttendeeDashboardAnalytics); // Get attendee analytics
router.get('/organizer', AuthMiddleware.authorizeOrganizer, AnalyticsController.getOrganizerAnalytics); // Get organizer analytics
router.get('/admin', AuthMiddleware.authorizeAdmin, AnalyticsController.getAdminAnalytics); // Get admin analytics

export default router;
