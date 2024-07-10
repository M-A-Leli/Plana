import { Router } from 'express';
import AdminController from '../controllers/Admin.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/profile', AuthMiddleware.authorizeAdmin, AdminController.getAdminProfile); // Get admin profile
router.put('/profile', AuthMiddleware.authorizeAdmin, AdminController.updateAdminProfile); // Update admin 

router.get('/', AuthMiddleware.authorizeAdmin, AdminController.getAllAdmins); // Get all admins
router.post('/', AuthMiddleware.authorizeAdmin, AdminController.createAdmin); // Create admin
router.get('/:id', AuthMiddleware.authorizeAdmin, AdminController.getAdminById); // Get admin by id
router.put('/:id', AuthMiddleware.authorizeAdmin, AdminController.updateAdmin); // Update admin
router.delete('/:id', AuthMiddleware.authorizeAdmin, AdminController.deleteAdmin); // Delete admin

export default router;
