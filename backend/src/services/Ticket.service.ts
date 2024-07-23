import { Ticket } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../config/Prisma.config';

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

    async createTicket(data: Omit<Ticket, 'id'>): Promise<Partial<Ticket>> {

        const { ticket_type_id, quantity, subtotal } = data;

        const order = await prisma.order.findUnique({
            where: { id: order_id },
        });

        if (!order || order.is_deleted) {
            throw createError(404, 'Order not found');
        }

        const ticketType = await prisma.ticketType.findUnique({
            where: { id: ticket_type_id },
        });

        if (!ticketType) {
            throw createError(404, 'Ticket type not found');
        }

        const uniqueCode = TicketService.generateUniqueCode(12);

        const newTicket = await prisma.ticket.create({
            data: {
                ...data,
                unique_code: uniqueCode,
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

        return newTicket;
    }

    async updateTicket(id: string, data: Partial<Ticket>): Promise<Partial<Ticket>> {
        const { order_id, quantity, subtotal } = data;

        const ticket = await prisma.ticket.findUnique({ where: { id } });

        if (!ticket || ticket.is_deleted) {
            throw createError(404, 'Ticket not found');
        }

        const order = await prisma.order.findUnique({
            where: { id: order_id },
        });

        if (!order || order.is_deleted) {
            throw createError(404, 'Order not found');
        }

        //! subtotal accumulation

        const updatedTicket = await prisma.ticket.update({
            where: { id },
            data,
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

        return updatedTicket;
    }

    async deleteTicket(id: string): Promise<void> {
        const ticket = await prisma.ticket.findUnique({ where: { id } });

        if (!ticket || ticket.is_deleted) {
            throw createError(404, 'Ticket not found');
        }

        await prisma.ticket.update({
            where: { id },
            data: { is_deleted: true }
        });
    }

    async validateTicket(data: Partial<Ticket>): Promise<Partial<Ticket>> {
        const { unique_code } = data;

        const ticket = await prisma.ticket.findFirst({
            where: { unique_code, is_deleted: false },
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

        const orders = await prisma.order.findMany({
            where: {
                attendee_id: attendee.id,
                is_deleted: false
            }
        });

        if (orders.length === 0) {
            throw createError(404, 'No orders found for this user');
            // return [];
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

        return tickets;
    }

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

        // ! the unpaid order

        const tickets = await prisma.ticket.findMany({
            where: { attendee_id: attendee.id, is_deleted: false },
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

        return tickets;
    }

    // ! select all orders, then select tickets related to those order.
    async getTicketsByEventId(id: string): Promise<Partial<Ticket>[]> {
        const event = await prisma.event.findUnique({
            where: { id }
        });

        if (!event || event.is_deleted) {
            throw createError(404, 'Event not found');
        }

        const tickets = await prisma.ticket.findMany({
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
        });

        return tickets;
    }

    async getTicketAnalytics(): Promise<Object> {
        const all_tickets = await prisma.ticket.count();

        const deleted_tickets = await prisma.ticket.count({
            where: { is_deleted: true },
        });

        // ! More analytics

        return {
            all_tickets,
            deleted_tickets
        };
    }
}

export default TicketService;
