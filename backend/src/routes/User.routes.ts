import { Router } from 'express';
import UserController from '../controllers/User.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/analytics', AuthMiddleware.authorizeAdmin, UserController.getUserAnalytics) // Get user analytics
router.get('/active', AuthMiddleware.authorizeAdmin, UserController.getActiveUsers) // Get active users
router.get('/suspended', AuthMiddleware.authorizeAdmin, UserController.getSuspendedUsers) // Get suspended users
router.get('/deleted', AuthMiddleware.authorizeAdmin, UserController.getDeletedUsers) // Get deleted users
router.get('/profile', AuthMiddleware.authorizeUser, UserController.getUserProfile) // Get user's profile
router.put('/profile', AuthMiddleware.authorizeUser, UserController.updateUserProfile) // Update user's profile
router.get('/profile-image', AuthMiddleware.authorizeUser, UserController.getUserProfileImage) // Get user's profile image
router.put('/profile-image', AuthMiddleware.authorizeUser, UserController.updateUserProfileImage) // Update user's profile image
router.get('/', AuthMiddleware.authorizeAdmin, UserController.getAllUsers); // Get all users
router.post('/', AuthMiddleware.authorizeAdmin, UserController.createUser); // Create user
router.put('/change-password', AuthMiddleware.authorizeUser, UserController.changePassword) // Change user password
router.get('/:id', AuthMiddleware.authorizeAdmin, UserController.getUserById); // Get user by id
router.put('/:id', AuthMiddleware.authorizeAdmin, UserController.updateUser); // Update user
router.delete('/:id', AuthMiddleware.authorizeAdmin, UserController.deleteUser); // Delete user
router.put('/suspend/:id', AuthMiddleware.authorizeAdmin, UserController.suspendUser); // Suspend user
router.put('/reinstate/:id', AuthMiddleware.authorizeAdmin, UserController.reinstateUser); // Reinstate user

export default router;
