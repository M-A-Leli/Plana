import { Router } from 'express';
import ReviewController from '../controllers/Review.controller';
import AuthMiddleware from '../middleware/Authorization';

const router = Router();

router.get('/analytics', ReviewController.getReviewAnalytics); // Get review analytics
router.get('/user', ReviewController.getReviewsByUserId); // Get user's reviews
router.get('/', ReviewController.getAllReviews); // Get all reviews
router.post('/', ReviewController.createReview); // Create review
router.get('/:id', ReviewController.getReviewById); // Get review by id
router.delete('/:id', ReviewController.deleteReview); // Delete review
router.get('/event/:id', ReviewController.getReviewsByEventId); // Get events's reviews

export default router;
