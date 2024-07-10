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

    async createReview(data: Omit<Review, 'id'>): Promise<Partial<Review>> {
        const attendee = await prisma.attendee.findUnique({
            where: {
                id: data.attendee_id
            }
        });

        if (!attendee || attendee.is_deleted) {
            throw createError(404, 'Attendee not found');
        }

        const user = await prisma.user.findUnique({
            where: {
                id: attendee.user_id
            }
        });

        if (!user || user.is_deleted) {
            throw createError(404, 'User not found');
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

        return newReview;
    }

    // async updateReview(id: string, data: Prisma.ReviewUpdateInput): Promise<Partial<Review>> {
    //     const review = await prisma.review.findUnique({
    //         where: { id },
    //     });

    //     if (!review) {
    //         throw createError(404, 'Review not found');
    //     }

    //     const updatedReview = await prisma.review.update({
    //         where: { id },
    //         data,
    //         select: {
    //             id: true,
    //             event_id: true,
    //             user_id: true,
    //             rating: true,
    //             comment: true,
    //             created_at: true,
    //             updated_at: true,
    //         },
    //     });

    //     return updatedReview;
    // }

    async deleteReview(id: string): Promise<void> {
        const review = await prisma.review.findUnique({ where: { id } });

        if (!review || review.is_deleted) {
            throw createError(404, 'Review not found');
        }

        await prisma.review.update({
            where: { id },
            data: { is_deleted: true }
        });
    }

    async getReviewsByUserId(id: string): Promise<Partial<Review>[]> {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user || user.is_deleted) {
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
}

export default ReviewService;
