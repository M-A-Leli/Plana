import { Router } from 'express';
import OrganizerController from '../controllers/Organizer.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/analytics', AuthMiddleware.authorizeAdmin, OrganizerController.getOrganizerAnalytics); // Get organizer analytics
router.put('/profile', AuthMiddleware.authorizeOrganizer, OrganizerController.updateOrganizerProfile); // Update organizer 
router.get('/profile', AuthMiddleware.authorizeOrganizer, OrganizerController.getOrganizerProfile); // Get organizer profile
router.get('/active', AuthMiddleware.authorizeAdmin, OrganizerController.getActiveOrganizers); // Get active organizers
router.get('/approved', AuthMiddleware.authorizeAdmin, OrganizerController.getApprovedOrganizers); // Get approved organizers
router.get('/deleted', AuthMiddleware.authorizeAdmin, OrganizerController.getDeletedOrganizers); // Get deleted organizers
router.get('/', AuthMiddleware.authorizeAdmin, OrganizerController.getAllOrganizers); // Get all organizers
router.post('/', AuthMiddleware.authorizeAttendee, OrganizerController.createOrganizer); // Create organizer on request
router.delete('/', AuthMiddleware.authorizeOrganizer, OrganizerController.deleteOrganizer); // Delete organizer
router.get('/:id', AuthMiddleware.authorizeAdmin, OrganizerController.getOrganizerById); // Get organizer by id
router.put('/:id', AuthMiddleware.authorizeAdmin, OrganizerController.updateOrganizer); // Update organizer
router.put('/approve/:id', AuthMiddleware.authorizeAdmin, OrganizerController.approveOrganizer); // Aprove organizer request
router.put('/revoke/:id', AuthMiddleware.authorizeAdmin, OrganizerController.revokeOrganizer); // Revoke organizer

export default router;
