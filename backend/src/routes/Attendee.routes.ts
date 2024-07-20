import { Router } from 'express';
import AttendeeController from '../controllers/Attendee.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/analytics', AuthMiddleware.authorizeAdmin, AttendeeController.getAttendeeAnalytics); // Get attendee analytics
router.get('/profile', AuthMiddleware.authorizeAttendee, AttendeeController.getAttendeeProfile); // Get attendee profile
router.put('/profile', AuthMiddleware.authorizeAttendee, AttendeeController.updateAttendeeProfile); // Update attendee
router.get('/active', AuthMiddleware.authorizeAdmin, AttendeeController.getActiveAttendees); // Get active attendees
router.get('/suspended', AuthMiddleware.authorizeAdmin, AttendeeController.getSuspendedAttendees); // Get suspended attendees
router.get('/deleted', AuthMiddleware.authorizeAdmin, AttendeeController.getDeletedAttendees); // Get deleted attendees
router.get('/', AuthMiddleware.authorizeAdmin, AttendeeController.getAllAttendees); // Get all attendees
router.post('/', AttendeeController.createAttendee); // Create attendee
router.get('/:id', AuthMiddleware.authorizeAdmin, AttendeeController.getAttendeeById); // Get attendee by id
router.put('/:id', AuthMiddleware.authorizeAdmin, AttendeeController.updateAttendee); // Update attendee
router.delete('/:id', AuthMiddleware.authorizeAttendee, AttendeeController.deleteAttendee); // Delete attendee

export default router;
