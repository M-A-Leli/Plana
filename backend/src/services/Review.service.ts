import { Review } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../config/Prisma.config';

class ReviewService {
    async getAllReviews(): Promise<Partial<Review>[]> {
        const reviews = await prisma.review.findMany({
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
                                username: true
                            }
                        }
                    }
                }
            }
        });

        if (reviews.length === 0) {
            throw createError(404, 'No reviews found');
        }

        return reviews;
    }

    async getReviewById(id: string): Promise<Partial<Review> | null> {
        const review = await prisma.review.findFirst({
            where: { id, is_deleted: false },
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
                                username: true
                            }
                        }
                    }
                }
            }
        });

        if (!review) {
            throw createError(404, 'Review not found');
        }

        return review;
    }

    async createReview(id: string, data: Omit<Review, 'id'>): Promise<Partial<Review>> {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user || user.is_deleted || user.is_suspended) {
            throw createError(404, 'User not found');
        }

        const attendee = await prisma.attendee.findUnique({
            where: {
                user_id: user.id
            }
        });

        if (!attendee || attendee.is_deleted) {
            throw createError(404, 'Attendee not found');
        }

        const event = await prisma.event.findUnique({
            where: {
                id: data.event_id
            }
        });

        if (!event || event.is_deleted) {
            throw createError(404, 'Event not found');
        }

        const reviewExists = await prisma.review.findFirst({
            where: {
                attendee_id: data.attendee_id,
                event_id: data.event_id,
                is_deleted: false
            }
        });

        if (reviewExists) {
            throw createError(409, 'Review already exists');
        }

        const newReview = await prisma.review.create({
            data,
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
                                username: true
                            }
                        }
                    }
                }
            }
        });

        const eventReviews = await prisma.review.findMany({
            where: {
                event_id: data.event_id,
                is_deleted: false,
            },
        });

        const numberOfReviews = eventReviews.length;
        const totalRating = eventReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / numberOfReviews;

        await prisma.event.update({
            where: { id: data.event_id },
            data: {
                average_rating: averageRating,
                number_of_reviews: numberOfReviews,
            },
        });

        return newReview;
    }

    async deleteReview(id: string): Promise<void> {
        const review = await prisma.review.findUnique({ where: { id } });

        if (!review || review.is_deleted) {
            throw createError(404, 'Review not found');
        }

        await prisma.review.update({
            where: { id },
            data: { is_deleted: true }
        });

        const eventReviews = await prisma.review.findMany({
            where: {
                event_id: review.event_id,
                is_deleted: false,
            },
        });

        const numberOfReviews = eventReviews.length;
        const totalRating = eventReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = numberOfReviews > 0 ? totalRating / numberOfReviews : 0;

        await prisma.event.update({
            where: { id: review.event_id },
            data: {
                average_rating: averageRating,
                number_of_reviews: numberOfReviews,
            },
        });
    }

    async getReviewsByUserId(id: string): Promise<Partial<Review>[]> {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user || user.is_deleted || user.is_suspended) {
            throw createError(404, 'User not found');
        }

        const attendee = await prisma.attendee.findUnique({
            where: {
                user_id: user.id
            }
        });

        if (!attendee || attendee.is_deleted) {
            throw createError(404, 'Attendee not found');
        }

        const reviews = await prisma.review.findMany({
            where: { attendee_id: attendee.id, is_deleted: false },
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
                                username: true
                            }
                        }
                    }
                }
            }
        });

        if (reviews.length === 0) {
            throw createError(404, 'No reviews found');
        }

        return reviews;
    }

    async getReviewsByEventId(id: string): Promise<Partial<Review>[]> {
        const event = await prisma.event.findUnique({ where: { id } });

        if (!event || event.is_deleted) {
            throw createError(404, 'Event not found');
        }

        const reviews = await prisma.review.findMany({
            where: { event_id: id, is_deleted: false },
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
                                username: true
                            }
                        }
                    }
                }
            }
        });

        if (reviews.length === 0) {
            throw createError(404, 'No reviews found');
        }

        return reviews;
    }

    async getReviewAnalytics(): Promise<Object> {
        const all_reviews = await prisma.review.count();

        const active_reviews = await prisma.review.count({
            where: {
                is_deleted: false,
            },
        });

        const deleted_reviews = await prisma.review.count({
            where: {
                is_deleted: true,
            },
        });

        const totalRating = await prisma.review.aggregate({
            _sum: {
                rating: true,
            },
            where: {
                is_deleted: false,
            },
        });

        const totalEvents = await prisma.event.count({
            where: {
                is_deleted: false,
            },
        });

        const totalEventsWithReviews = await prisma.event.count({
            where: {
                reviews: {
                    some: {
                        is_deleted: false,
                    },
                },
            },
        });

        const averageRating = active_reviews > 0 && totalRating._sum.rating != null ? totalRating._sum.rating / active_reviews : 0;
        const averageReviewsPerEvent = totalEventsWithReviews > 0 ? active_reviews / totalEventsWithReviews : 0;

        // ! More analytics

        return {
            all_reviews,
            active_reviews,
            deleted_reviews,
            averageRating,
            totalEvents,
            totalEventsWithReviews,
            averageReviewsPerEvent,
        };
    }
}

export default ReviewService;
