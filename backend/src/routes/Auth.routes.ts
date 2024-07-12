import { Router } from 'express';
import AuthController from '../controllers/Auth.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.post('/login', AuthController.login); // Login
router.post('/logout', AuthMiddleware.authorizeUser, AuthController.logout); // Logout
router.post('/refresh-token', AuthMiddleware.authorizeUser, AuthController.refreshToken); // Refresh token

export default router;
