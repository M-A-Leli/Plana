import { Router } from 'express';
import EventController from '../controllers/Event.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/analytics', AuthMiddleware.authorizeAdmin, EventController.getEventAnalytics); // Get event analytics
router.get('/featured-events', EventController.getFeaturedEvents); // Get featured events
router.get('/organizer', AuthMiddleware.authorizeOrganizer, EventController.getOrganizersEvents); // Get organizer's events
router.get('/organizer/upcoming', AuthMiddleware.authorizeOrganizer, EventController.getOrganizersUpcomingEvents); // Get organizer's upcoming events
router.get('/organizer/past', AuthMiddleware.authorizeOrganizer, EventController.getOrganizersPastEvents); // Get organizer's past events
router.get('/organizer/analytics', AuthMiddleware.authorizeOrganizer, EventController.getOrganizersEventsAnalytics); // Get organizer's events analytics
router.get('/', AuthMiddleware.authorizeAdmin, EventController.getAllEvents); // Get all events
router.get('/upcoming', EventController.getUpcomingEvents); // Get upcoming events
router.get('/past', AuthMiddleware.authorizeAdmin, EventController.getPastEvents); // Get past events
router.get('/deleted', AuthMiddleware.authorizeAdmin, EventController.getDeletedEvents); // Get deleted events
router.post('/', AuthMiddleware.authorizeOrganizer, EventController.createEvent); // Create event
router.get('/:id', EventController.getEventById); // Get event by id
router.put('/:id', AuthMiddleware.authorizeOrganizer, EventController.updateEvent); // Update event
router.delete('/:id', AuthMiddleware.authorizeOrganizer, EventController.deleteEvent); // Delete event
router.get('/related-events/:id', EventController.getRelatedEvents); // Get related events
router.put('/feature/:id', AuthMiddleware.authorizeAdmin, EventController.featureEvent); // Feature event
router.put('/featured/:id/exclude', AuthMiddleware.authorizeAdmin, EventController.removeFeaturedEvent); // Exclude event from featured
router.get('/organizer/:id', EventController.getEventsByOrganizerId); // Get events by organizer id
router.get('/organizer/:id/upcoming', EventController.getUpcomingEventsByOrganizerId); // Get organizer's upcoming events
router.get('/organizer/:id/past', EventController.getPastEventsByOrganizerId); // Get organizer's past events
router.get('/category/:id', EventController.getEventsByCategoryId); // Get upcoming events by category id

export default router;
