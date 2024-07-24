import createError from 'http-errors';
import prisma from '../config/Prisma.config';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

class AnalyticsService {

    async getAttendeeDashboardAnalytics(id: string) {
        const attendee = await prisma.attendee.findFirst({
            where: {
                user_id: id,
                is_deleted: false,
                user: {
                    is_suspended: false
                }
            }
        });

        if (!attendee) {
            throw createError(404, 'Attendee not found');
        }

        const totalEventsAttended = await prisma.order.count({
            where: {
                attendee_id: attendee.id,
                is_deleted: false,
            },
        });

        const totalOrders = await prisma.order.count({
            where: {
                attendee_id: attendee.id,
                is_deleted: false,
            },
        });

        const totalReviewsWritten = await prisma.review.count({
            where: {
                attendee_id: attendee.id,
                is_deleted: false,
            },
        });

        const totalTicketsPurchased = await prisma.ticket.count({
            where: {
                order: {
                    attendee_id: attendee.id,
                },
                is_deleted: false,
            },
        });

        const monthlyEventParticipation = await this.getMonthlyEventParticipation(attendee.id);

        const monthlyOrders = await this.getMonthlyOrders(attendee.id);

        const ratingsDistribution = await this.getRatingsDistribution(attendee.id);

        return {
            totalEventsAttended,
            totalOrders,
            totalReviewsWritten,
            totalTicketsPurchased,
            monthlyEventParticipation,
            monthlyOrders,
            ratingsDistribution,
        };
    }

    async getMonthlyEventParticipation(attendeeId: string) {
        const months = 6; // Last 6 months
        const participationData = [];

        for (let i = 0; i < months; i++) {
            const start = startOfMonth(subMonths(new Date(), i));
            const end = endOfMonth(start);

            const count = await prisma.order.count({
                where: {
                    attendee_id: attendeeId,
                    created_at: {
                        gte: start,
                        lte: end,
                    },
                    is_deleted: false,
                },
            });

            participationData.push({ month: start, count });
        }

        return participationData.reverse();
    }

    async getMonthlyOrders(attendeeId: string) {
        const months = 6; // Last 6 months
        const ordersData = [];

        for (let i = 0; i < months; i++) {
            const start = startOfMonth(subMonths(new Date(), i));
            const end = endOfMonth(start);

            const count = await prisma.order.count({
                where: {
                    attendee_id: attendeeId,
                    created_at: {
                        gte: start,
                        lte: end,
                    },
                    is_deleted: false,
                },
            });

            ordersData.push({ month: start, count });
        }

        return ordersData.reverse();
    }

    async getRatingsDistribution(attendeeId: string) {
        const ratings = await prisma.review.groupBy({
            by: ['rating'],
            where: {
                attendee_id: attendeeId,
                is_deleted: false,
            },
            _count: {
                _all: true,
            },
        });

        return ratings.map((r) => ({ rating: r.rating, count: r._count._all }));
    }

    // async getOrganizerDashboardAnalytics(organizerId: string) {
    //     const revenueOverTime = await this.getRevenueOverTime(organizerId);
    //     const totalTicketsSold = await this.getTotalTicketsSold(organizerId);
    //     const avgTicketsSoldPerEvent = await this.getAverageTicketsSoldPerEvent(organizerId);
    //     const bestSellingEvent = await this.getBestSellingEvent(organizerId);
    //     const highestRevenueEvent = await this.getHighestRevenueEvent(organizerId);
    //     const highestAttendanceEvent = await this.getHighestAttendanceEvent(organizerId);

    //     return {
    //         revenueOverTime,
    //         totalTicketsSold,
    //         avgTicketsSoldPerEvent,
    //         bestSellingEvent,
    //         highestRevenueEvent,
    //         highestAttendanceEvent,
    //     };
    // }

    // async getRevenueOverTime(organizerId: string) {
    //     const months = 6; // Last 6 months
    //     const revenueData = [];

    //     for (let i = 0; i < months; i++) {
    //         const start = startOfMonth(subMonths(new Date(), i));
    //         const end = endOfMonth(start);

    //         const revenue = await prisma.order.aggregate({
    //             _sum: {
    //                 total: true,
    //             },
    //             where: {
    //                 event: {
    //                     organizer_id: organizerId,
    //                 },
    //                 created_at: {
    //                     gte: start,
    //                     lte: end,
    //                 },
    //                 is_deleted: false,
    //             },
    //         });

    //         revenueData.push({ month: start, revenue: revenue._sum.total || 0 });
    //     }

    //     return revenueData.reverse();
    // }

    // async getTotalTicketsSold(organizerId: string) {
    //     const totalTickets = await prisma.ticket.count({
    //         where: {
    //             order: {
    //                 event: {
    //                     organizer_id: organizerId,
    //                 },
    //             },
    //             is_deleted: false,
    //         },
    //     });

    //     return totalTickets;
    // }

    // async getAverageTicketsSoldPerEvent(organizerId: string) {
    //     const events = await prisma.event.findMany({
    //         where: {
    //             organizer_id: organizerId,
    //             is_deleted: false,
    //         },
    //     });

    //     const totalTicketsSold = await prisma.ticket.count({
    //         where: {
    //             order: {
    //                 event: {
    //                     organizer_id: organizerId,
    //                 },
    //             },
    //             is_deleted: false,
    //         },
    //     });

    //     const avgTicketsSoldPerEvent = events.length ? totalTicketsSold / events.length : 0;

    //     return avgTicketsSoldPerEvent;
    // }

    // async getBestSellingEvent(organizerId: string) {
    //     const bestSellingEvent = await prisma.event.findFirst({
    //         where: {
    //             organizer_id: organizerId,
    //             is_deleted: false,
    //         },
    //         orderBy: {
    //             _count: {
    //                 tickets: true,
    //             },
    //         },
    //         include: {
    //             tickets: {
    //                 where: {
    //                     is_deleted: false,
    //                 },
    //             },
    //         },
    //     });

    //     return bestSellingEvent;
    // }

    // async getHighestRevenueEvent(organizerId: string) {
    //     const highestRevenueEvent = await prisma.event.findFirst({
    //         where: {
    //             organizer_id: organizerId,
    //             is_deleted: false,
    //         },
    //         orderBy: {
    //             orders: {
    //                 _sum: {
    //                     total: true,
    //                 },
    //             },
    //         },
    //         include: {
    //             orders: {
    //                 where: {
    //                     is_deleted: false,
    //                 },
    //             },
    //         },
    //     });

    //     return highestRevenueEvent;
    // }

    // async getHighestAttendanceEvent(organizerId: string) {
    //     const highestAttendanceEvent = await prisma.event.findFirst({
    //         where: {
    //             organizer_id: organizerId,
    //             is_deleted: false,
    //         },
    //         orderBy: {
    //             _count: {
    //                 orders: true,
    //             },
    //         },
    //         include: {
    //             orders: {
    //                 where: {
    //                     is_deleted: false,
    //                 },
    //             },
    //         },
    //     });

    //     return highestAttendanceEvent;
    // }

    // async getAdminDashboardAnalytics() {
    //     const userAnalytics = await this.getUserAnalytics();
    //     const eventAnalytics = await this.getEventAnalytics();

    //     return {
    //         userAnalytics
    //         eventAnalytics
    //     };
    // }

    // async getUserAnalytics() {
    //     const totalUsers = await this.getTotalUsers();
    //     const activeUsers = await this.getActiveUsers();
    //     const suspendedUsers = await this.getSuspendedUsers();
    //     const newUserOverTime = await this.getNewUsersOverTime();

    //     return {
    //         totalUsers,
    //         activeUsers,
    //         suspendedUsers,
    //         newUserOverTime,
    //     };
    // }

    // async getTotalUsers() {
    //     const total = await prisma.user.count({
    //         where: {
    //             is_deleted: false,
    //         },
    //     });

    //     return total;
    // }

    // async getActiveUsers() {
    //     const active = await prisma.user.count({
    //         where: {
    //             is_deleted: false,
    //             is_suspended: false,
    //         },
    //     });

    //     return active;
    // }

    // async getSuspendedUsers() {
    //     const suspended = await prisma.user.count({
    //         where: {
    //             is_deleted: false,
    //             is_suspended: true,
    //         },
    //     });

    //     return suspended;
    // }

    // async getNewUsersOverTime() {
    //     const months = 6; // Last 6 months
    //     const newUserData = [];

    //     for (let i = 0; i < months; i++) {
    //         const start = startOfMonth(subMonths(new Date(), i));
    //         const end = endOfMonth(start);

    //         const newUsers = await prisma.user.count({
    //             where: {
    //                 created_at: {
    //                     gte: start,
    //                     lte: end,
    //                 },
    //                 is_deleted: false,
    //             },
    //         });

    //         newUserData.push({ month: start, newUsers });
    //     }

    //     return newUserData.reverse();
    // }

    // async getEventAnalytics() {
    //     const totalEvents = await this.getTotalEvents();
    //     const activeEvents = await this.getActiveEvents();
    //     const upcomingEvents = await this.getUpcomingEvents();
    //     const pastEvents = await this.getPastEvents();
    //     const revenueOverTime = await this.getTotalRevenueOverTime();
    //     const avgTicketsSold = await this.getTotalAverageTicketsSoldPerEvent();
    //     const bestSellingEvent = await this.getOverallBestSellingEvent();
    //     const highestAttendanceEvent = await this.getOverallHighestAttendanceEvent();

    //     return {
    //         totalEvents,
    //         activeEvents,
    //         upcomingEvents,
    //         pastEvents,
    //         revenueOverTime,
    //         avgTicketsSold,
    //         bestSellingEvent,
    //         highestAttendanceEvent,
    //     };
    // }

    // async getTotalEvents() {
    //     const total = await prisma.event.count({
    //         where: {
    //             is_deleted: false,
    //         },
    //     });

    //     return total;
    // }

    // async getActiveEvents() {
    //     const active = await prisma.event.count({
    //         where: {
    //             is_deleted: false,
    //             end_time: {
    //                 gte: new Date(),
    //             },
    //         },
    //     });

    //     return active;
    // }

    // async getUpcomingEvents() {
    //     const upcoming = await prisma.event.count({
    //         where: {
    //             is_deleted: false,
    //             start_time: {
    //                 gte: new Date(),
    //             },
    //         },
    //     });

    //     return upcoming;
    // }

    // async getPastEvents() {
    //     const past = await prisma.event.count({
    //         where: {
    //             is_deleted: false,
    //             end_time: {
    //                 lt: new Date(),
    //             },
    //         },
    //     });

    //     return past;
    // }

    // async getTotalRevenueOverTime() {
    //     const months = 6; // Last 6 months
    //     const revenueData = [];

    //     for (let i = 0; i < months; i++) {
    //         const start = startOfMonth(subMonths(new Date(), i));
    //         const end = endOfMonth(start);

    //         const revenue = await prisma.event.aggregate({
    //             _sum: {
    //                 orders: {
    //                     total: true,
    //                 },
    //             },
    //             where: {
    //                 is_deleted: false,
    //                 orders: {
    //                     some: {
    //                         created_at: {
    //                             gte: start,
    //                             lte: end,
    //                         },
    //                     },
    //                 },
    //             },
    //         });

    //         revenueData.push({
    //             month: start,
    //             revenue: revenue._sum.orders?.total || 0,
    //         });
    //     }

    //     return revenueData.reverse();
    // }

    // async getTotalAverageTicketsSoldPerEvent() {
    //     const avgTickets = await prisma.event.aggregate({
    //         _avg: {
    //             tickets: {
    //                 quantity: true,
    //             },
    //         },
    //         where: {
    //             is_deleted: false,
    //         },
    //     });

    //     return avgTickets._avg.tickets || 0;
    // }

    // async getOverallBestSellingEvent() {
    //     const event = await prisma.event.findMany({
    //         where: {
    //             is_deleted: false,
    //         },
    //         orderBy: {
    //             _count: {
    //                 tickets: {
    //                     _sum: {
    //                         quantity: true,
    //                     },
    //                 },
    //             },
    //         },
    //         take: 1,
    //     });

    //     return event[0];
    // }

    // async getOverallHighestAttendanceEvent() {
    //     const event = await prisma.event.findMany({
    //         where: {
    //             is_deleted: false,
    //         },
    //         orderBy: {
    //             _count: {
    //                 orders: true,
    //             },
    //         },
    //         take: 1,
    //     });

    //     return event[0];
    // }
}

export default AnalyticsService;
