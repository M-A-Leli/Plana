import createError from 'http-errors';
import { Event, Prisma } from '@prisma/client';
import prisma from '../config/Prisma.config';

const BASE_URL = `http://localhost:${process.env.PORT}`;

class EventService {

    async getAllEvents(): Promise<Partial<Event>[]> {
        const events = await prisma.event.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                time: true,
                venue: true,
                average_rating: true,
                number_of_reviews: true,
                organizer: {
                    select: {
                        id: true,
                        company: true,
                    }
                },
                images: {
                    where: { is_deleted: false },
                    select: {
                        id: true,
                        url: true,
                    }
                }
            }
        });

        if (events.length === 0) {
            throw createError(404, 'No events found');
        }

        return events;
    }

    async getEventById(id: string): Promise<Partial<Event> | null> {
        const event = await prisma.event.findFirst({
            where: { id, is_deleted: false },
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                time: true,
                venue: true,
                average_rating: true,
                number_of_reviews: true,
                organizer: {
                    select: {
                        id: true,
                        company: true,
                    }
                },
                images: {
                    where: { is_deleted: false },
                    select: {
                        id: true,
                        url: true,
                    }
                }
            }
        });

        if (!event) {
            throw createError(404, 'Event not found');
        }

        return event;
    }

    async createEvent(id: string, data: Omit<Prisma.EventCreateInput, 'id' | 'organizer_id'>, imagePaths: string[]): Promise<Partial<Event> | null> {
        const organizer = await prisma.organizer.findFirst({
            where: {
                user_id: id,
                is_deleted: false,
                user: {
                    is_suspended: false,
                },
            },
        });

        if (!organizer) {
            throw createError(404, 'Organizer not found');
        }

        const user = await prisma.user.findUnique({
            where: { id: organizer.user_id },
        });

        if (!user || user.is_deleted || user.is_suspended) {
            throw createError(404, 'User not found');
        }

        if (imagePaths.length > 4) {
            throw createError(400, 'An event can have at most 4 images');
        }

        const eventData: Prisma.EventUncheckedCreateInput = {
            ...data,
            organizer_id: organizer.id,
            images: {
                create: imagePaths.map(path => ({
                    url: `${BASE_URL}/images/${path.split('/').pop()}`,
                })),
            },
        };

        const event = await prisma.event.create({
            data: eventData,
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                time: true,
                venue: true,
                average_rating: true,
                number_of_reviews: true,
                organizer: {
                    select: {
                        id: true,
                        company: true,
                    }
                },
                images: {
                    where: { is_deleted: false },
                    select: {
                        id: true,
                        url: true,
                    }
                }
            }
        });

        return event;
    }

    async updateEvent(id: string, data: Partial<Omit<Prisma.EventUpdateInput, 'id'>>, imagePaths: string[]): Promise<Partial<Event> | null> {
        const event = await prisma.event.findUnique({
            where: { id },
        });

        if (!event || event.is_deleted) {
            throw createError(404, 'Event not found');
        }

        const updateData: Prisma.EventUpdateInput = {
            ...data,
        };

        if (imagePaths.length > 0) {
            updateData.images = {
                create: imagePaths.map(path => ({
                    url: `${BASE_URL}/images/${path.split('/').pop()}`,
                })),
            };
        }

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                time: true,
                venue: true,
                average_rating: true,
                number_of_reviews: true,
                organizer: {
                    select: {
                        id: true,
                        company: true,
                    }
                },
                images: {
                    where: { is_deleted: false },
                    select: {
                        id: true,
                        url: true,
                    }
                }
            }
        });

        return updatedEvent;
    }

    async deleteEvent(id: string) {
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                tickets: {
                    where: {
                        is_deleted: false
                    }
                }
            }
        });

        if (!event || event.is_deleted) {
            throw createError(404, 'Event not found');
        }

        const purchasedTickets = event.tickets.length > 0;

        if (purchasedTickets) {
            //! Placeholder for refund logic
            // await paymentService.refundAttendees(event.id);

            // !
            throw createError(400, 'Event cannot be deleted as it has purchased tickets');
        }

        await prisma.event.update({
            where: { id },
            data: { is_deleted: true }
        }).catch((error) => {
            throw createError(500, `Error deleting event: ${error.message}`);
        });
    }

    async getEventsByOrganizerId(id: string): Promise<Partial<Event>[]> {
        const organizer = await prisma.organizer.findUnique({
            where: { id },
        });

        if (!organizer || organizer.is_deleted) {
            throw createError(404, 'Organizer not found');
        }

        const events = await prisma.event.findMany({
            where: {
                organizer_id: id,
                is_deleted: false
            },
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                time: true,
                venue: true,
                average_rating: true,
                number_of_reviews: true,
                organizer: {
                    select: {
                        id: true,
                        company: true,
                    }
                },
                images: {
                    where: { is_deleted: false },
                    select: {
                        id: true,
                        url: true,
                    }
                }
            }
        });

        if (events.length === 0) {
            throw createError(404, 'No events found');
        }

        return events;
    }

    async getUpcomingEventsByOrganizerId(id: string): Promise<Partial<Event>[]> {
        const organizer = await prisma.organizer.findUnique({
            where: { id },
        });

        if (!organizer || organizer.is_deleted) {
            throw createError(404, 'Organizer not found');
        }

        const currentDate = new Date();
        const events = await prisma.event.findMany({
            where: {
                date: {
                    gte: currentDate,
                },
                organizer_id: id,
                is_deleted: false
            },
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                time: true,
                venue: true,
                average_rating: true,
                number_of_reviews: true,
                organizer: {
                    select: {
                        id: true,
                        company: true,
                    }
                },
                images: {
                    where: { is_deleted: false },
                    select: {
                        id: true,
                        url: true,
                    }
                }
            }
        });

        if (events.length === 0) {
            throw createError(404, 'No events found');
        }

        return events;
    }

    async getPastEventsByOrganizerId(id: string): Promise<Partial<Event>[]> {
        const organizer = await prisma.organizer.findUnique({
            where: { id },
        });

        if (!organizer || organizer.is_deleted) {
            throw createError(404, 'Organizer not found');
        }

        const currentDate = new Date();
        const events = await prisma.event.findMany({
            where: {
                date: {
                    lt: currentDate,
                },
                organizer_id: id,
                is_deleted: false
            },
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                time: true,
                venue: true,
                average_rating: true,
                number_of_reviews: true,
                organizer: {
                    select: {
                        id: true,
                        company: true,
                    }
                },
                images: {
                    where: { is_deleted: false },
                    select: {
                        id: true,
                        url: true,
                    }
                }
            }
        });

        if (events.length === 0) {
            throw createError(404, 'No events found');
        }

        return events;
    }

    async getOrganizersEvents(id: string): Promise<Partial<Event>[]> {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user || user.is_deleted || user.is_suspended) {
            throw createError(404, 'User not found');
        }

        const organizer = await prisma.organizer.findUnique({
            where: { user_id: user.id },
        });

        if (!organizer || organizer.is_deleted) {
            throw createError(404, 'Organizer not found');
        }

        const events = await prisma.event.findMany({
            where: {
                organizer_id: id,
                is_deleted: false
            },
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                time: true,
                venue: true,
                average_rating: true,
                number_of_reviews: true,
                organizer: {
                    select: {
                        id: true,
                        company: true,
                    }
                },
                images: {
                    where: { is_deleted: false },
                    select: {
                        id: true,
                        url: true,
                    }
                }
            }
        });

        if (events.length === 0) {
            throw createError(404, 'No events found');
        }

        return events;
    }

    async getRelatedEvents(id: string): Promise<Partial<Event>[]> {
        const event = await prisma.event.findUnique({
            where: { id },
        });

        if (!event || event.is_deleted) {
            throw createError(404, 'Event not found');
        }

        const currentDate = new Date();
        const relatedEvents = await prisma.event.findMany({
            where: {
                organizer_id: event.organizer_id,
                is_deleted: false,
                date: {
                    gte: currentDate,
                },
                id: { not: event.id },
            },
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                time: true,
                venue: true,
                average_rating: true,
                number_of_reviews: true,
                organizer: {
                    select: {
                        id: true,
                        company: true,
                    }
                },
                images: {
                    where: { is_deleted: false },
                    select: {
                        id: true,
                        url: true,
                    }
                }
            },
            take: 4
        });

        if (relatedEvents.length === 0) {
            throw createError(404, 'No related events found');
        }

        return relatedEvents;
    }

    async getFeaturedEvents(): Promise<Partial<Event>[]> {
        const currentDate = new Date();
        const featuredEvents = await prisma.event.findMany({
            where: {
                date: {
                    gte: currentDate
                },
                is_deleted: false,
                is_featured: true,
            },
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                time: true,
                venue: true,
                average_rating: true,
                number_of_reviews: true,
                organizer: {
                    select: {
                        id: true,
                        company: true,
                    }
                },
                images: {
                    where: { is_deleted: false },
                    select: {
                        id: true,
                        url: true,
                    }
                }
            },
            take: 8
        });

        if (featuredEvents.length === 0) {
            throw createError(404, 'No featured events found');
        }

        return featuredEvents;
    }

    async featureEvent(eventId: string): Promise<Partial<Event> | null> {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                reviews: {
                    where: { is_deleted: false },
                    select: {
                        rating: true,
                    },
                },
            },
        });

        if (!event || event.is_deleted) {
            throw createError(404, 'Event not found');
        }

        const currentDate = new Date();
        const eventDate = new Date(event.date);

        if (eventDate <= currentDate) {
            throw createError(400, 'Event must be upcoming to be featured');
        }

        const minimumReviews = 10;
        const minimumRating = 4.0;
        const numberOfReviews = event.reviews.length;
        const averageRating = numberOfReviews > 0 ? event.reviews.reduce((sum, review) => sum + review.rating, 0) / numberOfReviews : 0;

        if (numberOfReviews < minimumReviews || averageRating < minimumRating) {
            throw createError(400, `Event must have at least ${minimumReviews} reviews and an average rating of ${minimumRating} to be featured`);
        }

        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: {
                is_featured: true,
            },
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                time: true,
                venue: true,
                average_rating: true,
                number_of_reviews: true,
                is_featured: true,
            },
        });

        return updatedEvent;
    }

    async removeFeaturedEvent(eventId: string): Promise<Partial<Event> | null> {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event || event.is_deleted) {
            throw createError(404, 'Event not found');
        }

        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: {
                is_featured: false,
            },
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                time: true,
                venue: true,
                average_rating: true,
                number_of_reviews: true,
                is_featured: true,
            },
        });

        return updatedEvent;
    }

    async getUpcomingEvents(): Promise<Partial<Event>[]> {
        const currentDate = new Date();
        const events = await prisma.event.findMany({
            where: {
                date: {
                    gte: currentDate,
                },
                is_deleted: false,
            },
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                time: true,
                venue: true,
                average_rating: true,
                number_of_reviews: true,
                organizer: {
                    select: {
                        id: true,
                        company: true,
                    }
                },
                images: {
                    where: { is_deleted: false },
                    select: {
                        id: true,
                        url: true,
                    }
                }
            }
        });

        if (events.length === 0) {
            throw createError(404, 'No upcoming events found');
        }

        return events;
    }

    async getPastEvents(): Promise<Partial<Event>[]> {
        const currentDate = new Date();
        const events = await prisma.event.findMany({
            where: {
                date: {
                    lt: currentDate,
                },
                is_deleted: false,
            },
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                time: true,
                venue: true,
                average_rating: true,
                number_of_reviews: true,
                organizer: {
                    select: {
                        id: true,
                        company: true,
                    }
                },
                images: {
                    where: { is_deleted: false },
                    select: {
                        id: true,
                        url: true,
                    }
                }
            }
        });

        if (events.length === 0) {
            throw createError(404, 'No past events found');
        }

        return events;
    }

    async getDeletedEvents(): Promise<Partial<Event>[]> {
        const events = await prisma.event.findMany({
            where: {
                is_deleted: true,
            },
            select: {
                id: true,
                title: true,
                description: true,
                date: true,
                time: true,
                venue: true,
                average_rating: true,
                number_of_reviews: true,
                organizer: {
                    select: {
                        id: true,
                        company: true,
                    }
                },
                images: {
                    select: {
                        id: true,
                        url: true,
                    }
                }
            }
        });

        if (events.length === 0) {
            throw createError(404, 'No deleted events found');
        }

        return events;
    }

    async getEventAnalytics(): Promise<Object> {
        const currentDate = new Date();

        const all_events = await prisma.event.count();

        const active_events = await prisma.event.count({
            where: {
                is_deleted: false,
            },
        });

        const deleted_events = await prisma.event.count({
            where: { is_deleted: true },
        });

        const upcoming_events = await prisma.event.count({
            where: {
                date: {
                    gte: currentDate,
                },
                is_deleted: false,
            },
        });

        const past_events = await prisma.event.count({
            where: {
                date: {
                    lt: currentDate,
                },
                is_deleted: false,
            },
        });

        const average_rating = await prisma.event.aggregate({
            where: {
                is_deleted: false,
            },
            _avg: {
                average_rating: true,
            },
        });

        const total_reviews = await prisma.event.aggregate({
            where: {
                is_deleted: false,
            },
            _sum: {
                number_of_reviews: true,
            },
        });

        // ! More analytics

        return {
            all_events,
            active_events,
            deleted_events,
            upcoming_events,
            past_events,
            average_rating: average_rating._avg.average_rating || 0,
            total_reviews: total_reviews._sum.number_of_reviews || 0,
        };
    }
}

export default EventService;
