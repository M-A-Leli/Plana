import { Router } from 'express';
import EventController from '../controllers/Event.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/featured-events', EventController.getFeaturedEvents); // Get featured events
router.get('/organizer', EventController.getEventsByOrganizerId); // Get organizer's events
router.get('/', EventController.getAllEvents); // Get all events
router.post('/', EventController.createEvent); // Create event
router.get('/:id', EventController.getEventById); // Get event by id
router.put('/:id', EventController.updateEvent); // Update event
router.delete('/:id', EventController.deleteEvent); // Delete event
router.get('/related-events/:id', EventController.getRelatedEvents); // Get related events

export default router;
