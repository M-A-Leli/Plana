import { Router } from 'express';
import TicketController from '../controllers/Ticket.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/analytics', AuthMiddleware.authorizeAdmin, TicketController.getTicketAnalytics); // Get ticket analytics
router.get('/', AuthMiddleware.authorizeAdmin, TicketController.getAllTickets); // Get all tickets
router.post('/', AuthMiddleware.authorizeAttendee, TicketController.createTicket); // Create ticket
router.get('/:id', AuthMiddleware.authorizeUser, TicketController.getTicketById); // Get ticket by id
router.put('/:id', AuthMiddleware.authorizeAdmin, TicketController.updateTicket); // Update ticket
router.delete('/:id', AuthMiddleware.authorizeAttendee, TicketController.deleteTicket); // Delete ticket
router.get('/validate/:id', AuthMiddleware.authorizeOrganizer, TicketController.validateTicket); // Validate ticket
router.get('/user', AuthMiddleware.authorizeAttendee, TicketController.getTicketsByUserId); // Get tickets by user id
router.get('/event/user/:id', AuthMiddleware.authorizeAttendee, TicketController.getEventTicketsByUserId); // Get event tickets by user id
router.get('/order/:id',  AuthMiddleware.authorizeAttendee, TicketController.getTicketsByOrderId); // Get tickets by order id
router.get('/event/:id',  AuthMiddleware.authorizeOrganizer, TicketController.getTicketsByEventId); // Get tickets by event id

export default router;
