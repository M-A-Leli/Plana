import createError from 'http-errors';
import { Event, Prisma } from '@prisma/client';
import prisma from '../config/Prisma.config';

const BASE_URL = `http://localhost:${process.env.PORT}`;

class EventService {

    async getAllEvents(): Promise<Partial<Event>[]> {
        const events = await prisma.event.findMany({
            where: {
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

    async createEvent(data: Omit<Prisma.EventCreateInput, 'id'>, imagePaths: string[]) {

        if (imagePaths.length > 4) {
            throw createError(400, 'A event can have at most 4 images');
        }

        const eventData = {
            ...data,
            images: {
                create: imagePaths.map(path => ({
                    url: `${BASE_URL}/images/${path.split('/').pop()}`,
                })),
            },
        };

        //! Organizer exists

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

    async updateEvent(id: string, data: Partial<Omit<Prisma.EventUpdateInput, 'id'>>, imagePaths: string[]) {
        const event = await prisma.event.findUnique({
            where: { id },
        });

        if (!event || event.is_deleted) {
            throw createError(404, 'Event not found');
        }

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                ...data,
                images: {
                    create: imagePaths.map(path => ({
                        url: `${BASE_URL}/images/${path.split('/').pop()}`,
                    })),
                },
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

        return updatedEvent;
    }

    async deleteEvent(id: string) {
        const event = await prisma.event.findUnique({ where: { id } });

        if (!event || event.is_deleted) {
            throw createError(404, 'Event not found');
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

    async getRelatedEvents(id: string): Promise<Partial<Event>[]> {
        const event = await prisma.event.findUnique({
            where: { id },
        });

        if (!event || event.is_deleted) {
            throw createError(404, 'Event not found');
        }

        const relatedEvents = await prisma.event.findMany({
            where: {
                organizer_id: event.organizer_id,
                is_deleted: false,
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
        const featuredEvents = await prisma.event.findMany({
            where: {
                is_deleted: false,
                is_featured: true
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
}

export default EventService;
