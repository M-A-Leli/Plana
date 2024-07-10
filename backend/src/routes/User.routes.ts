import { Router } from 'express';
import UserController from '../controllers/User.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.post('/suspend/:id', UserController.suspendUser); // Suspend user
router.get('/', UserController.getAllUsers); // Get all users
router.post('/', UserController.createUser); // Create user
router.get('/:id', UserController.getUserById); // Get user by id
router.put('/:id', UserController.updateUser); // Update user
router.delete('/:id', UserController.deleteUser); // Delete user

export default router;
