import { Router } from 'express';
import OrganizerController from '../controllers/Organizer.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/profile', AuthMiddleware.authorizeOrganizer, OrganizerController.getOrganizerProfile); // Get organizer profile
router.put('/profile', AuthMiddleware.authorizeOrganizer, OrganizerController.updateOrganizerProfile); // Update organizer 

router.get('/', OrganizerController.getAllOrganizers); // Get all organizers
router.post('/', OrganizerController.createOrganizer); // Create organizer
router.get('/:id', OrganizerController.getOrganizerById); // Get organizer by id
router.put('/:id', OrganizerController.updateOrganizer); // Update organizer
router.delete('/:id', OrganizerController.deleteOrganizer); // Delete organizer

export default router;
