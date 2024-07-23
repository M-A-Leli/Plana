import { Router } from 'express';
import TicketTypeController from '../controllers/TicketTypes.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/', AuthMiddleware.authorizeAdmin, TicketTypeController.getAllTicketTypes); // Get all ticket types
router.post('/', AuthMiddleware.authorizeOrganizer, TicketTypeController.createTicketType); // Create ticket type
router.get('/:id', TicketTypeController.getTicketTypeById); // Get ticket type by id
router.put('/:id', AuthMiddleware.authorizeOrganizer, TicketTypeController.updateTicketType); // Update ticket type
router.delete('/:id', AuthMiddleware.authorizeOrganizer, TicketTypeController.deleteTicketType); // Delete ticket type
router.get('/event/:id', TicketTypeController.getTicketTypesByEventId); // Get ticket type by event id

export default router;
