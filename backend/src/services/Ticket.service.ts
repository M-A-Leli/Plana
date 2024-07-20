import { Ticket, Prisma } from '@prisma/client';
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
            where: { is_deleted: false },
            select: {
                //! more on event specific data
                id: true,
                ticket_type_id: true,
                attendee_id: true,
                event_id: true,
                unique_code: true,
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
                //! more on event specific data
                id: true,
                ticket_type_id: true,
                attendee_id: true,
                event_id: true,
                unique_code: true,
            }
        });

        if (!ticket) {
            throw createError(404, 'Ticket not found');
        }

        return ticket;
    }

    async createTicket(data: Omit<Ticket, 'id'>): Promise<Partial<Ticket>> {
        const event = await prisma.event.findUnique({
          where: { id: data.event_id },
        });
      
        if (!event || event.is_deleted) {
          throw createError(404, 'Event not found');
        }
      
        const ticketType = await prisma.ticketType.findUnique({
          where: { id: data.ticket_type_id },
        });
      
        if (!ticketType) {
          throw createError(404, 'Ticket type not found');
        }
      
        const attendee = await prisma.attendee.findUnique({
          where: { id: data.attendee_id },
        });
      
        if (!attendee || attendee.is_deleted) {
          throw createError(404, 'Attendee not found');
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
            attendee_id: true,
            event_id: true,
            unique_code: true,
          },
        });
      
        return newTicket;
      }

    async updateTicket(id: string, data: Prisma.TicketUpdateInput): Promise<Partial<Ticket>> {
        const ticket = await prisma.ticket.findUnique({ where: { id } });

        if (!ticket || ticket.is_deleted) {
            throw createError(404, 'Ticket not found');
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id },
            data,
            select: {
                //! more on event specific data
                id: true,
                ticket_type_id: true,
                attendee_id: true,
                event_id: true,
                unique_code: true,
            }
        });

        return updatedTicket;
    }

    async deleteTicket(id: string): Promise<void> {
        const ticket = await prisma.ticket.findUnique({ where: { id } });

        if (!ticket || ticket.is_deleted) {
            throw createError(404, 'Ticket not found');
        }

        await prisma.ticket.delete({ where: { id } });
    }

    async validateTicket(id: string): Promise<Partial<Ticket>> {
        const ticket = await prisma.ticket.findFirst({
            where: { id, is_deleted: false },
            select: {
                //! more on event specific data
                id: true,
                ticket_type_id: true,
                attendee_id: true,
                event_id: true,
                unique_code: true,
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

        const tickets = await prisma.ticket.findMany({
            where: { attendee_id: attendee.id, is_deleted: false },
            select: {
                //! more on event specific data
                id: true,
                ticket_type_id: true,
                attendee_id: true,
                event_id: true,
                unique_code: true,
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

        const tickets = await prisma.ticket.findMany({
            where: { attendee_id: attendee.id, is_deleted: false },
            select: {
                //! more on event specific data
                id: true,
                ticket_type_id: true,
                attendee_id: true,
                event_id: true,
                unique_code: true,
            }
        });

        return tickets;
    }

    async getTicketsByEventId(id: string): Promise<Partial<Ticket>[]> {
        const event = await prisma.event.findUnique({
            where: { id }
        });

        if (!event || event.is_deleted) {
            throw createError(404, 'Event not found');
        }

        const tickets = await prisma.ticket.findMany({
            where: { event_id: id, is_deleted: false },
            select: {
                //! more on event specific data
                id: true,
                ticket_type_id: true,
                attendee_id: true,
                event_id: true,
                unique_code: true,
            }
        });

        return tickets;
    }
}

export default TicketService;
