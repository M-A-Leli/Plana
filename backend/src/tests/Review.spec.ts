import createError from 'http-errors';
import prisma from '../config/Prisma.config';
import ReviewService from '../services/Review.service';

jest.mock('../config/Prisma.config', () => ({
    review: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
        aggregate: jest.fn(),
    },
    user: {
        findUnique: jest.fn(),
    },
    attendee: {
        findUnique: jest.fn(),
    },
    event: {
        findUnique: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
    },
}));

describe('ReviewService', () => {
    const reviewService = new ReviewService();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllReviews', () => {
        it('should retrieve all non-deleted reviews', async () => {
            const reviews = [
                { id: 'review1', rating: 5, comment: 'Great!', event_id: 'event1', created_at: new Date(), attendee: { id: 'attendee1', user: { id: 'user1', username: 'user1' } } },
                // Add more review objects as needed
            ];

            (prisma.review.findMany as jest.Mock).mockResolvedValue(reviews);

            const result = await reviewService.getAllReviews();

            expect(result).toEqual(reviews);
            expect(prisma.review.findMany).toHaveBeenCalledWith({
                where: { is_deleted: false },
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    event_id: true,
                    created_at: true,
                    attendee: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                },
                            },
                        },
                    },
                },
            });
        });

        it('should throw a 404 error if no reviews are found', async () => {
            (prisma.review.findMany as jest.Mock).mockResolvedValue([]);

            await expect(reviewService.getAllReviews()).rejects.toThrow(createError(404, 'No reviews found'));
        });
    });

    describe('getReviewById', () => {
        it('should retrieve a review by ID', async () => {
            const review = { id: 'review1', rating: 5, comment: 'Great!', event_id: 'event1', created_at: new Date(), attendee: { id: 'attendee1', user: { id: 'user1', username: 'user1' } } };

            (prisma.review.findFirst as jest.Mock).mockResolvedValue(review);

            const result = await reviewService.getReviewById('review1');

            expect(result).toEqual(review);
            expect(prisma.review.findFirst).toHaveBeenCalledWith({
                where: { id: 'review1', is_deleted: false },
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    event_id: true,
                    created_at: true,
                    attendee: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                },
                            },
                        },
                    },
                },
            });
        });

        it('should throw a 404 error if the review is not found', async () => {
            (prisma.review.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(reviewService.getReviewById('review1')).rejects.toThrow(createError(404, 'Review not found'));
        });
    });

    describe('createReview', () => {
        it('should create a review and update event ratings', async () => {
            const userId = 'user1';
            const reviewData = { rating: 5, comment: 'Great!', event_id: 'event1', attendee_id: 'attendee1', is_deleted: false, created_at: new Date() };
            const user = { id: userId, is_deleted: false, is_suspended: false };
            const attendee = { id: 'attendee1', is_deleted: false };
            const event = { id: 'event1', is_deleted: false };
            const newReview = { id: 'review1', ...reviewData, created_at: new Date() };
            const eventReviews = [
                { rating: 5 }
            ];

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.attendee.findUnique as jest.Mock).mockResolvedValue(attendee);
            (prisma.event.findUnique as jest.Mock).mockResolvedValue(event);
            (prisma.review.findFirst as jest.Mock).mockResolvedValue(null);
            (prisma.review.create as jest.Mock).mockResolvedValue(newReview);
            (prisma.review.findMany as jest.Mock).mockResolvedValue(eventReviews);
            (prisma.event.update as jest.Mock).mockResolvedValue(event);

            const result = await reviewService.createReview(userId, reviewData);

            expect(result).toEqual(newReview);
            expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
            expect(prisma.attendee.findUnique).toHaveBeenCalledWith({ where: { user_id: userId } });
            expect(prisma.event.findUnique).toHaveBeenCalledWith({ where: { id: reviewData.event_id } });
            expect(prisma.review.findFirst).toHaveBeenCalledWith({
                where: {
                    attendee_id: reviewData.attendee_id,
                    event_id: reviewData.event_id,
                    is_deleted: false,
                },
            });
            expect(prisma.review.create).toHaveBeenCalledWith({
                data: reviewData,
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    event_id: true,
                    created_at: true,
                    attendee: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                },
                            },
                        },
                    },
                },
            });
            expect(prisma.event.update).toHaveBeenCalledWith({
                where: { id: reviewData.event_id },
                data: {
                    average_rating: expect.any(Number),
                    number_of_reviews: expect.any(Number),
                },
            });
        });

        it('should throw a 404 error if the user is not found', async () => {
            const reviewData = { rating: 5, comment: 'Great!', event_id: 'event1', attendee_id: 'attendee1', is_deleted: false, created_at: new Date() };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(reviewService.createReview('user1', reviewData)).rejects.toThrow(createError(404, 'User not found'));
        });

        it('should throw a 404 error if the attendee is not found', async () => {
            const user = { id: 'user1', is_deleted: false, is_suspended: false };
            const reviewData = { rating: 5, comment: 'Great!', event_id: 'event1', attendee_id: 'attendee1', is_deleted: false, created_at: new Date() };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.attendee.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(reviewService.createReview('user1', reviewData)).rejects.toThrow(createError(404, 'Attendee not found'));
        });

        it('should throw a 404 error if the event is not found', async () => {
            const user = { id: 'user1', is_deleted: false, is_suspended: false };
            const attendee = { id: 'attendee1', is_deleted: false };
            const reviewData = { rating: 5, comment: 'Great!', event_id: 'event1', attendee_id: 'attendee1', is_deleted: false, created_at: new Date() };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.attendee.findUnique as jest.Mock).mockResolvedValue(attendee);
            (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(reviewService.createReview('user1', reviewData)).rejects.toThrow(createError(404, 'Event not found'));
        });

        it('should throw a 409 error if the review already exists', async () => {
            const user = { id: 'user1', is_deleted: false, is_suspended: false };
            const attendee = { id: 'attendee1', is_deleted: false };
            const event = { id: 'event1', is_deleted: false };
            const reviewData = { rating: 5, comment: 'Great!', event_id: 'event1', attendee_id: 'attendee1', is_deleted: false, created_at: new Date() };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.attendee.findUnique as jest.Mock).mockResolvedValue(attendee);
            (prisma.event.findUnique as jest.Mock).mockResolvedValue(event);
            (prisma.review.findFirst as jest.Mock).mockResolvedValue({ id: 'review1', ...reviewData, is_deleted: false });

            await expect(reviewService.createReview('user1', reviewData)).rejects.toThrow(createError(409, 'Review already exists'));
        });
    });

    describe('deleteReview', () => {
        it('should delete a review and update event ratings', async () => {
            const review = { id: 'review1', event_id: 'event1', is_deleted: false, rating: 5 };
            const eventReviews = [
                { rating: 4 },
            ];

            (prisma.review.findUnique as jest.Mock).mockResolvedValue(review);
            (prisma.review.update as jest.Mock).mockResolvedValue(review);
            (prisma.review.findMany as jest.Mock).mockResolvedValue(eventReviews);
            (prisma.event.update as jest.Mock).mockResolvedValue({ id: 'event1', average_rating: 4, number_of_reviews: 1 });

            await reviewService.deleteReview('review1');

            expect(prisma.review.findUnique).toHaveBeenCalledWith({ where: { id: 'review1' } });
            expect(prisma.review.update).toHaveBeenCalledWith({
                where: { id: 'review1' },
                data: { is_deleted: true },
            });
            expect(prisma.event.update).toHaveBeenCalledWith({
                where: { id: 'event1' },
                data: {
                    average_rating: expect.any(Number),
                    number_of_reviews: expect.any(Number),
                },
            });
        });

        it('should throw a 404 error if the review is not found', async () => {
            (prisma.review.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(reviewService.deleteReview('review1')).rejects.toThrow(createError(404, 'Review not found'));
        });
    });

    describe('getReviewsByUserId', () => {
        it('should retrieve reviews by user ID', async () => {
            const user = { id: 'user1', is_deleted: false, is_suspended: false };
            const attendee = { id: 'attendee1', is_deleted: false };
            const reviews = [
                { id: 'review1', rating: 5, comment: 'Great!', event_id: 'event1', created_at: new Date(), attendee: { id: 'attendee1', user: { id: 'user1', username: 'user1' } } }
            ];

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.attendee.findUnique as jest.Mock).mockResolvedValue(attendee);
            (prisma.review.findMany as jest.Mock).mockResolvedValue(reviews);

            const result = await reviewService.getReviewsByUserId('user1');

            expect(result).toEqual(reviews);
            expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 'user1' } });
            expect(prisma.attendee.findUnique).toHaveBeenCalledWith({ where: { user_id: 'user1' } });
            expect(prisma.review.findMany).toHaveBeenCalledWith({
                where: { attendee_id: 'attendee1', is_deleted: false },
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    event_id: true,
                    created_at: true,
                    attendee: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                },
                            },
                        },
                    },
                },
            });
        });

        it('should throw a 404 error if no reviews are found for the user', async () => {
            const user = { id: 'user1', is_deleted: false, is_suspended: false };
            const attendee = { id: 'attendee1', is_deleted: false };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.attendee.findUnique as jest.Mock).mockResolvedValue(attendee);
            (prisma.review.findMany as jest.Mock).mockResolvedValue([]);

            await expect(reviewService.getReviewsByUserId('user1')).rejects.toThrow(createError(404, 'No reviews found'));
        });
    });

    describe('getReviewsByEventId', () => {
        it('should retrieve reviews by event ID', async () => {
            const event = { id: 'event1', is_deleted: false };
            const reviews = [
                { id: 'review1', rating: 5, comment: 'Great!', event_id: 'event1', created_at: new Date(), attendee: { id: 'attendee1', user: { id: 'user1', username: 'user1' } } }
            ];

            (prisma.event.findUnique as jest.Mock).mockResolvedValue(event);
            (prisma.review.findMany as jest.Mock).mockResolvedValue(reviews);

            const result = await reviewService.getReviewsByEventId('event1');

            expect(result).toEqual(reviews);
            expect(prisma.event.findUnique).toHaveBeenCalledWith({ where: { id: 'event1' } });
            expect(prisma.review.findMany).toHaveBeenCalledWith({
                where: { event_id: 'event1', is_deleted: false },
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    event_id: true,
                    created_at: true,
                    attendee: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                },
                            },
                        },
                    },
                },
            });
        });

        it('should throw a 404 error if no reviews are found for the event', async () => {
            const event = { id: 'event1', is_deleted: false };

            (prisma.event.findUnique as jest.Mock).mockResolvedValue(event);
            (prisma.review.findMany as jest.Mock).mockResolvedValue([]);

            await expect(reviewService.getReviewsByEventId('event1')).rejects.toThrow(createError(404, 'No reviews found'));
        });
    });

    describe('getReviewAnalytics', () => {
        it('should retrieve review analytics', async () => {
            const allReviewsCount = 10;
            const activeReviewsCount = 8;
            const deletedReviewsCount = 2;
            const totalRating = { _sum: { rating: 40 } };
            const totalEvents = 5;
            const totalEventsWithReviews = 3;

            (prisma.review.count as jest.Mock).mockResolvedValueOnce(allReviewsCount);
            (prisma.review.count as jest.Mock).mockResolvedValueOnce(activeReviewsCount);
            (prisma.review.count as jest.Mock).mockResolvedValueOnce(deletedReviewsCount);
            (prisma.review.aggregate as jest.Mock).mockResolvedValue(totalRating);
            (prisma.event.count as jest.Mock).mockResolvedValueOnce(totalEvents);
            (prisma.event.count as jest.Mock).mockResolvedValueOnce(totalEventsWithReviews);

            const result = await reviewService.getReviewAnalytics();

            expect(result).toEqual({
                all_reviews: allReviewsCount,
                active_reviews: activeReviewsCount,
                deleted_reviews: deletedReviewsCount,
                averageRating: 5, // totalRating._sum.rating / active_reviews
                totalEvents,
                totalEventsWithReviews,
                averageReviewsPerEvent: 2.67, // active_reviews / totalEventsWithReviews
            });
        });
    });
});
