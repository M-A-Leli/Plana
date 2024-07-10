import { Router } from 'express';
import TicketController from '../controllers/Ticket.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/', TicketController.getAllTickets); // Get all tickets
router.post('/', TicketController.createTicket); // Create ticket
router.get('/:id', TicketController.getTicketById); // Get ticket by id
router.put('/:id', TicketController.updateTicket); // Update ticket
router.delete('/:id', TicketController.deleteTicket); // Delete ticket
router.get('/validate/:id', TicketController.validateTicket); // Validate ticket
router.get('/user/:id', TicketController.getTicketsByUserId); // Get tickets by user id
router.get('/event/user/:id', TicketController.getEventTicketsByUserId); // Get event tickets by user id
router.get('/event/:id', TicketController.getTicketsByEventId); // Get tickets by event id

export default router;
