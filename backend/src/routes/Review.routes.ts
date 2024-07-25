import { Router } from 'express';
import ReviewController from '../controllers/Review.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/analytics', AuthMiddleware.authorizeAdmin, ReviewController.getReviewAnalytics); // Get review analytics
router.get('/user', AuthMiddleware.authorizeAttendee, ReviewController.getReviewsByUserId); // Get user's reviews
router.get('/', AuthMiddleware.authorizeAdmin, ReviewController.getAllReviews); // Get all reviews
router.post('/', AuthMiddleware.authorizeAttendee, ReviewController.createReview); // Create review
router.get('/:id', AuthMiddleware.authorizeUser, ReviewController.getReviewById); // Get review by id
router.delete('/:id', AuthMiddleware.authorizeAttendee, ReviewController.deleteReview); // Delete review
router.get('/event/:id', ReviewController.getReviewsByEventId); // Get events's reviews

export default router;
