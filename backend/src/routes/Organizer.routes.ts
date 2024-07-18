import { Router } from 'express';
import OrganizerController from '../controllers/Organizer.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

// router.get('/profile', AuthMiddleware.authorizeOrganizer, OrganizerController.getOrganizerProfile); // Get organizer profile
// router.put('/profile', AuthMiddleware.authorizeOrganizer, OrganizerController.updateOrganizerProfile); // Update organizer 

router.get('/analytics', OrganizerController.getOrganizerAnalytics); // Get organizer analytics
router.put('/profile', OrganizerController.updateOrganizerProfile); // Update organizer 
router.get('/profile', OrganizerController.getOrganizerProfile); // Get organizer profile
router.get('/active', OrganizerController.getActiveOrganizers); // Get active organizers
router.get('/approved', OrganizerController.getApprovedOrganizers); // Get approved organizers
router.get('/deleted', OrganizerController.getDeletedOrganizers); // Get deleted organizers
router.get('/', OrganizerController.getAllOrganizers); // Get all organizers
router.post('/', OrganizerController.createOrganizer); // Create organizer on request
router.get('/:id', OrganizerController.getOrganizerById); // Get organizer by id
router.put('/:id', OrganizerController.updateOrganizer); // Update organizer
router.delete('/:id', OrganizerController.deleteOrganizer); // Delete organizer
router.put('/approve/:id', OrganizerController.approveOrganizer); // Aprove organizer request
router.put('/revoke/:id', OrganizerController.revokeOrganizer); // Revoke organizer

export default router;
