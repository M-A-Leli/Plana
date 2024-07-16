import { Router } from 'express';
import UserController from '../controllers/User.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/analytics', UserController.getUserAnalytics) // Get user analytics
router.get('/active', UserController.getActiveUsers) // Get active users
router.get('/suspended', UserController.getSuspendedUsers) // Get suspended users
router.get('/deleted', UserController.getDeletedUsers) // Get deleted users
router.get('/profile', UserController.getUserProfile) // Get user's profile
router.put('/profile', UserController.updateUserProfile) // Update user's profile
router.get('/profile-image', UserController.getUserProfileImage) // Get user's profile image
router.put('/profile-image', UserController.updateUserProfileImage) // Update user's profile image
router.get('/', UserController.getAllUsers); // Get all users
router.post('/', UserController.createUser); // Create user
router.get('/:id', UserController.getUserById); // Get user by id
router.put('/:id', UserController.updateUser); // Update user
router.delete('/:id', UserController.deleteUser); // Delete user
router.put('/suspend/:id', UserController.suspendUser); // Suspend user

export default router;
