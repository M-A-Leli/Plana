import { Router } from 'express';
import AttendeeController from '../controllers/Attendee.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

// router.get('/profile', AuthMiddleware.authorizeAttendee, AttendeeController.getAttendeeProfile); // Get attendee profile
// router.put('/profile', AuthMiddleware.authorizeAttendee, AttendeeController.updateAttendeeProfile); // Update attendee 

router.get('/analytics', AttendeeController.getAttendeeAnalytics); // Get attendee analytics
router.get('/profile', AttendeeController.getAttendeeProfile); // Get attendee profile
router.put('/profile', AttendeeController.updateAttendeeProfile); // Update attendee 
router.get('/', AttendeeController.getAllAttendees); // Get all attendees
router.post('/', AttendeeController.createAttendee); // Create attendee
router.get('/:id', AttendeeController.getAttendeeById); // Get attendee by id
router.put('/:id', AttendeeController.updateAttendee); // Update attendee
router.delete('/:id', AttendeeController.deleteAttendee); // Delete attendee

export default router;
