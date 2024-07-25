import { Prisma, Ticket } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../config/Prisma.config';
import { name } from 'ejs';

class TicketService {
    static generateUniqueCode(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            code += chars[randomIndex];
        }
        return code;
    }

    async getAllTickets(): Promise<Partial<Ticket>[]> {
        const tickets = await prisma.ticket.findMany({
            select: {
                id: true,
                ticket_type_id: true,
                order_id: true,
                quantity: true,
                subtotal: true,
                unique_code: true,
                is_deleted: true,
                updated_at: true
            }
        });

        if (tickets.length === 0) {
            throw createError(404, 'No tickets found');
        }

        return tickets;
    }

    async getTicketById(id: string): Promise<Partial<Ticket>> {
        const ticket = await prisma.ticket.findFirst({
            where: { id, is_deleted: false },
            select: {
                id: true,
                ticket_type_id: true,
                order_id: true,
                quantity: true,
                subtotal: true,
                unique_code: true,
                is_deleted: true,
                updated_at: true
            }
        });

        if (!ticket) {
            throw createError(404, 'Ticket not found');
        }

        return ticket;
    }

    async createTicket(id: string, data: Omit<Ticket, 'id'>): Promise<Partial<Ticket>> {
        const { ticket_type_id } = data;

        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user || user.is_deleted) {
            throw createError(404, 'User not found');
        }

        const attendee = await prisma.attendee.findUnique({
            where: { user_id: user.id }
        });

        if (!attendee || attendee.is_deleted) {
            throw createError(404, 'Attendee not found');
        }

        const ticket_type = await prisma.ticketType.findUnique({
            where: { id: ticket_type_id }
        });

        if (!ticket_type || ticket_type.is_deleted) {
            throw createError(404, 'Ticket type not found');
        }

        const unpaidOrder = await prisma.order.findFirst({
            where: {
                attendee_id: attendee.id,
                payment_id: null,
                is_deleted: false
            },
        });

        let ticket;

        const uniqueCode = TicketService.generateUniqueCode(12);

        if (!unpaidOrder) {
            const [newOrder, newTicket] = await prisma.$transaction(async (tx) => {
                const createdOrder = await tx.order.create({
                    data: {
                        attendee_id: attendee.id,
                        event_id: ticket_type.event_id,
                        total: ticket_type.price
                    }
                });

                const createdTicket = await tx.ticket.create({
                    data: {
                        ticket_type_id: ticket_type_id,
                        order_id: createdOrder.id,
                        quantity: 1,
                        subtotal: ticket_type.price,
                        unique_code: uniqueCode
                    }
                });

                return [createdOrder, createdTicket];
            });

            ticket = newTicket;
        } else {
            const existingTicket = await prisma.ticket.findFirst({
                where: {
                    ticket_type_id: ticket_type_id,
                    order_id: unpaidOrder.id
                }
            });

            if (existingTicket) {
                const [updatedTicket, updatedOrder] = await prisma.$transaction(async (tx) => {
                    const updatedItem = await tx.ticket.update({
                        where: { id: existingTicket.id },
                        data: {
                            quantity: existingTicket.quantity + 1,
                            subtotal: new Prisma.Decimal(existingTicket.subtotal.toNumber() + ticket_type.price.toNumber())
                        }
                    });

                    const updatedOrder = await tx.order.update({
                        where: { id: unpaidOrder.id },
                        data: {
                            total: new Prisma.Decimal(unpaidOrder.total.toNumber() + ticket_type.price.toNumber())
                        }
                    });

                    return [updatedItem, updatedOrder];
                });

                ticket = updatedTicket;
            } else {
                const [newTicket, updatedOrder] = await prisma.$transaction(async (tx) => {
                    const createdTicket = await tx.ticket.create({
                        data: {
                            ticket_type_id: ticket_type_id,
                            order_id: unpaidOrder.id,
                            quantity: 1,
                            subtotal: ticket_type.price,
                            unique_code: uniqueCode
                        }
                    });

                    const updatedOrder = await tx.order.update({
                        where: { id: unpaidOrder.id },
                        data: {
                            total: new Prisma.Decimal(unpaidOrder.total.toNumber() + ticket_type.price.toNumber())
                        }
                    });

                    return [createdTicket, updatedOrder];
                });

                ticket = newTicket;
            }
        }

        return ticket;
    }

    async updateTicket(id: string, data: Partial<Ticket>): Promise<Partial<Ticket>> {
        const { order_id, quantity, subtotal } = data; //!

        const ticket = await prisma.ticket.findUnique({
            where: { id },
            select: {
                id: true,
                ticket_type_id: true,
                order_id: true,
                quantity: true,
                subtotal: true,
                unique_code: true,
                is_deleted: true,
                updated_at: true,
                order: {
                    select: {
                        total: true
                    }
                }
            }
        });

        if (!ticket || ticket.is_deleted) {
            throw createError(404, 'Ticket not found');
        }

        const ticket_type = await prisma.ticketType.findUnique({
            where: { id: ticket.ticket_type_id }
        });

        if (!ticket_type || ticket_type.is_deleted) {
            throw createError(404, 'Ticket type not found');
        }

        if (ticket_type.availability === 0) {
            throw createError(400, "Ticket type unavailable");
        }

        if (quantity !== undefined && quantity < 1) {
            throw createError(400, "Quantity cannot be less than 1");
        }

        const newSubtotal = quantity ? new Prisma.Decimal(quantity * ticket_type.price.toNumber()) : ticket.subtotal;

        const updatedTicket = await prisma.$transaction(async (tx) => {
            const updatedItem = await tx.ticket.update({
                where: { id },
                data: {
                    quantity: quantity || ticket.quantity,
                    subtotal: newSubtotal
                }
            });

            await tx.order.update({
                where: { id: ticket.order_id },
                data: {
                    total: new Prisma.Decimal(ticket.order.total.toNumber() - ticket.subtotal.toNumber() + newSubtotal.toNumber())
                }
            });

            return updatedItem;
        });

        return {
            id: updatedTicket.id,
            ticket_type_id: updatedTicket.ticket_type_id,
            order_id: updatedTicket.order_id,
            quantity: updatedTicket.quantity,
            subtotal: updatedTicket.subtotal,
            unique_code: updatedTicket.unique_code,
            is_deleted: updatedTicket.is_deleted,
            updated_at: updatedTicket.updated_at,
        };
    }

    async deleteTicket(id: string): Promise<void> {
        const ticket = await prisma.ticket.findUnique({
            where: { id },
            include: { order: true }
        });

        if (!ticket || ticket.is_deleted) {
            throw createError(404, 'Ticket not found');
        }

        await prisma.$transaction(async (tx) => {
            await tx.ticket.update({
                where: { id },
                data: { is_deleted: true }
            });

            if (!ticket.order.payment_id) {
                await tx.order.update({
                    where: { id: ticket.order_id },
                    data: {
                        total: new Prisma.Decimal(ticket.order.total.toNumber() - ticket.subtotal.toNumber())
                    }
                });
            }
        });
    }


    async validateTicket(code: string): Promise<Partial<Ticket>> {
        const ticket = await prisma.ticket.findFirst({
            where: { unique_code: code, is_deleted: false },
            select: {
                id: true,
                ticket_type_id: true,
                order_id: true,
                quantity: true,
                subtotal: true,
                unique_code: true,
                is_deleted: true,
                updated_at: true
            }
        });

        if (!ticket) {
            throw createError(404, 'Valid ticket not found');
        }

        return ticket;
    }

    async getTicketsByUserId(id: string): Promise<Partial<Ticket>[]> {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user || user.is_deleted) {
            throw createError(404, 'User not found');
        }

        const attendee = await prisma.attendee.findUnique({
            where: { user_id: user.id }
        });

        if (!attendee || attendee.is_deleted) {
            throw createError(404, 'Attendee not found');
        }

        const pendingOrder = await prisma.order.findFirst({
            where: {
                attendee_id: attendee.id,
                is_deleted: false,
                payment_id: null
            }
        });

        const tickets = await prisma.ticket.findMany({
            where: {
                order_id: pendingOrder?.id,
                is_deleted: false
            },
            select: {
                id: true,
                ticket_type_id: true,
                order_id: true,
                quantity: true,
                subtotal: true,
                unique_code: true,
                is_deleted: true,
                updated_at: true,
                ticket_type: {
                    select: {
                        id: true,
                        name: true,
                        group_size: true,
                        price: true,
                        event: {
                            select: {
                                title: true,
                                id: true,
                            }
                        }
                    }
                }
            }
        });

        return tickets;
    }
    
    // async getTicketsByUserId(id: string): Promise<Partial<Ticket>[]> {
    //     const user = await prisma.user.findUnique({
    //         where: { id }
    //     });

    //     if (!user || user.is_deleted) {
    //         throw createError(404, 'User not found');
    //     }

    //     const attendee = await prisma.attendee.findUnique({
    //         where: { user_id: user.id }
    //     });

    //     if (!attendee || attendee.is_deleted) {
    //         throw createError(404, 'Attendee not found');
    //     }

    //     const orders = await prisma.order.findMany({
    //         where: {
    //             attendee_id: attendee.id,
    //             is_deleted: false
    //         }
    //     });

    //     if (orders.length === 0) {
    //         throw createError(404, 'No orders found for this user');
    //         // return [];
    //     }

    //     const orderIds = orders.map(order => order.id);

    //     const tickets = await prisma.ticket.findMany({
    //         where: {
    //             order_id: { in: orderIds },
    //             is_deleted: false
    //         },
    //         select: {
    //             id: true,
    //             ticket_type_id: true,
    //             order_id: true,
    //             quantity: true,
    //             subtotal: true,
    //             unique_code: true,
    //             is_deleted: true,
    //             updated_at: true,
    //             ticket_type: {
    //                 select: {
    //                     id: true,
    //                     name: true,
    //                     group_size: true,
    //                     price: true,
    //                     event: {
    //                         select: {
    //                             title: true,
    //                             id: true,
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     });

    //     return tickets;
    // }

    async getEventTicketsByUserId(user_id: string, event_id: string): Promise<Partial<Ticket>[]> {
        const event = await prisma.event.findUnique({
            where: { id: event_id }
        });
    
        if (!event || event.is_deleted) {
            throw createError(404, 'Event not found');
        }
    
        const user = await prisma.user.findUnique({
            where: { id: user_id }
        });
    
        if (!user || user.is_deleted) {
            throw createError(404, 'User not found');
        }
    
        const attendee = await prisma.attendee.findUnique({
            where: { user_id: user.id }
        });
    
        if (!attendee || attendee.is_deleted) {
            throw createError(404, 'Attendee not found');
        }
    
        const unpaidOrder = await prisma.order.findFirst({
            where: {
                attendee_id: attendee.id,
                event_id: event.id,
                is_deleted: false,
                payment_id: null
            },
            include: {
                tickets: {
                    where: { is_deleted: false },
                    select: {
                        id: true,
                        ticket_type_id: true,
                        order_id: true,
                        quantity: true,
                        subtotal: true,
                        unique_code: true,
                        is_deleted: true,
                        updated_at: true
                    }
                }
            }
        });
    
        if (!unpaidOrder) {
            throw createError(404, 'No unpaid order found for this user and event');
        }
    
        return unpaidOrder.tickets;
    }

    async getTicketsByEventId(event_id: string): Promise<Partial<Ticket>[]> {
        const event = await prisma.event.findUnique({
            where: { id: event_id }
        });
    
        if (!event || event.is_deleted) {
            throw createError(404, 'Event not found');
        }
    
        const orders = await prisma.order.findMany({
            where: {
                event_id: event.id,
                is_deleted: false
            },
            select: {
                id: true
            }
        });
    
        if (orders.length === 0) {
            throw createError(404, 'No orders found for this event');
        }
    
        const orderIds = orders.map(order => order.id);
    
        const tickets = await prisma.ticket.findMany({
            where: {
                order_id: { in: orderIds },
                is_deleted: false
            },
            select: {
                id: true,
                ticket_type_id: true,
                order_id: true,
                quantity: true,
                subtotal: true,
                unique_code: true,
                is_deleted: true,
                updated_at: true
            }
        });
    
        if (tickets.length === 0) {
            throw createError(404, 'No tickets found for this event');
        }
    
        return tickets;
    }

    async getTicketsByOrderId(order_id: string): Promise<Partial<Ticket>[]> {
        const order = await prisma.order.findUnique({
            where: { id: order_id }
        });
    
        if (!order || order.is_deleted) {
            throw createError(404, 'Order not found');
        }
    
        const tickets = await prisma.ticket.findMany({
            where: {
                order_id: order_id,
                is_deleted: false
            },
            select: {
                id: true,
                ticket_type_id: true,
                order_id: true,
                quantity: true,
                subtotal: true,
                unique_code: true,
                is_deleted: true,
                updated_at: true,
                ticket_type: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        event: {
                            select: {
                                id: true,
                                title: true,
                            }
                        }
                    }
                }
            }
        });
    
        if (tickets.length === 0) {
            throw createError(404, 'No tickets found for this event');
        }
    
        return tickets;
    }
    
    async getTicketAnalytics(): Promise<Object> {
        const all_tickets = await prisma.ticket.count();
    
        const deleted_tickets = await prisma.ticket.count({
            where: { is_deleted: true }
        });
    
        const active_tickets = await prisma.ticket.count({
            where: { is_deleted: false }
        });
    
        const tickets_by_type = await prisma.ticket.groupBy({
            by: ['ticket_type_id'],
            _count: {
                ticket_type_id: true
            }
        });
    
        const paid_tickets = await prisma.ticket.count({
            where: {
                is_deleted: false,
                order: {
                    payment_id: { not: null }
                }
            }
        });
    
        const unpaid_tickets = await prisma.ticket.count({
            where: {
                is_deleted: false,
                order: {
                    payment_id: null
                }
            }
        });
    
        const tickets_by_event = await prisma.ticket.groupBy({
            by: ['order_id'],
            _count: {
                order_id: true
            }
        }).then(groups => {
            const eventTickets = groups.map(async group => {
                const order = await prisma.order.findUnique({
                    where: { id: group.order_id },
                    select: { event_id: true }
                });
                return { event_id: order?.event_id, count: group._count.order_id };
            });
            return Promise.all(eventTickets);
        });
    
        const tickets_by_attendee = await prisma.ticket.groupBy({
            by: ['order_id'],
            _count: {
                order_id: true
            }
        }).then(groups => {
            const attendeeTickets = groups.map(async group => {
                const order = await prisma.order.findUnique({
                    where: { id: group.order_id },
                    select: { attendee_id: true }
                });
                return { attendee_id: order?.attendee_id, count: group._count.order_id };
            });
            return Promise.all(attendeeTickets);
        });
    
        const total_revenue = await prisma.ticket.aggregate({
            _sum: {
                subtotal: true
            },
            where: {
                is_deleted: false
            }
        });
    
        const average_ticket_price = await prisma.ticket.aggregate({
            _avg: {
                subtotal: true
            },
            where: {
                is_deleted: false
            }
        });
    
        return {
            all_tickets,
            deleted_tickets,
            active_tickets,
            tickets_by_type,
            paid_tickets,
            unpaid_tickets,
            tickets_by_event,
            tickets_by_attendee,
            total_revenue: total_revenue._sum.subtotal,
            average_ticket_price: average_ticket_price._avg.subtotal
        };
    }
}

export default TicketService;
