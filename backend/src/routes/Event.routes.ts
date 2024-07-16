import { Router } from 'express';
import EventController from '../controllers/Event.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/analytics', EventController.getEventAnalytics); // Get event analytics
router.get('/featured-events', EventController.getFeaturedEvents); // Get featured events
router.get('/organizer', EventController.getOrganizersEvents); // Get organizer's events
router.get('/', EventController.getAllEvents); // Get all events
router.get('/upcoming', EventController.getUpcomingEvents); // Get upcaoming events
router.get('/past', EventController.getPastEvents); // Get past events
router.get('/deleted', EventController.getDeletedEvents); // Get deleted events
router.post('/', EventController.createEvent); // Create event
router.get('/:id', EventController.getEventById); // Get event by id
router.put('/:id', EventController.updateEvent); // Update event
router.delete('/:id', EventController.deleteEvent); // Delete event
router.get('/related-events/:id', EventController.getRelatedEvents); // Get related events
router.put('/feature/:id', EventController.featureEvent); // Feature event
router.put('/featured/:id/exclude', EventController.removeFeaturedEvent); // Exclude event from featured
router.get('/organizer/:id', EventController.getEventsByOrganizerId); // Get events by organizer id
router.get('/organizer/:id/upcoming', EventController.getUpcomingEventsByOrganizerId); // Get organizer's upcoming events
router.get('/organizer/:id/past', EventController.getPastEventsByOrganizerId); // Get organizer's past events

export default router;
