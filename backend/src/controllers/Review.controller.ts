import { Request, Response, NextFunction } from 'express';
import ReviewService from '../services/Review.service';

class ReviewController {

  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviews = await this.reviewService.getAllReviews();
      res.status(200).json(reviews);
    } catch (error: any) {
      next(error);
    }
  }

  getReviewById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await this.reviewService.getReviewById(req.params.id);
      res.status(200).json(review);
    } catch (error: any) {
      next(error);
    }
  }

  createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const review = await this.reviewService.createReview(req.body);
      res.status(201).json(review);
    } catch (error: any) {
      next(error);
    }
  }

  deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.reviewService.deleteReview(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }

  getReviewsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const reviews = await this.reviewService.getReviewsByUserId(user_id);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  }

  getReviewsByEventId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviews = await this.reviewService.getReviewsByEventId(req.params.id);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  }
}

export default new ReviewController();
