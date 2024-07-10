import { TicketType } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../config/Prisma.config';

class TicketTypeService {
  async getAllTicketTypes(): Promise<Partial<TicketType>[]> {
    const ticketTypes = await prisma.ticketType.findMany({
      where: { is_deleted: false },
      select: {
        id: true,
        event_id: true,
        name: true,
        type: true,
        price: true,
        availability: true,
        group_size: true,
      }
    });

    if (ticketTypes.length === 0) {
        throw createError(404, 'No ticket types found');
    }

    return ticketTypes;
  }

  async getTicketTypeById(id: string): Promise<Partial<TicketType> | null> {
    const ticketType = await prisma.ticketType.findFirst({
      where: { id, is_deleted: false },
      select: {
        id: true,
        event_id: true,
        name: true,
        type: true,
        price: true,
        availability: true,
        group_size: true,
      }
    });

    if (!ticketType) {
      throw createError(404, 'TicketType not found');
    }

    return ticketType;
  }

  async createTicketType(data: Omit<TicketType, 'id'>): Promise<Partial<TicketType>> {
    const event = await prisma.event.findUnique({
      where: {
        id: data.event_id,
      },
    });

    if (!event || event.is_deleted) {
      throw createError(404, 'Event not found');
    }

    const newTicketType = await prisma.ticketType.create({
      data,
      select: {
        id: true,
        event_id: true,
        name: true,
        type: true,
        price: true,
        availability: true,
        group_size: true,
      }
    });

    return newTicketType;
  }

  async updateTicketType(id: string, data: Partial<Omit<TicketType, 'id'>>): Promise<Partial<TicketType>> {
    const ticketType = await prisma.ticketType.findUnique({
      where: { id },
    });

    if (!ticketType || ticketType.is_deleted) {
      throw createError(404, 'TicketType not found');
    }

    const updatedTicketType = await prisma.ticketType.update({
      where: { id },
      data,
      select: {
        id: true,
        event_id: true,
        name: true,
        type: true,
        price: true,
        availability: true,
        group_size: true,
      }
    });

    return updatedTicketType;
  }

  async deleteTicketType(id: string): Promise<void> {
    const ticketType = await prisma.ticketType.findUnique({ where: { id } });

    if (!ticketType || ticketType.is_deleted) {
      throw createError(404, 'Ticket type not found');
    }

    await prisma.ticketType.update({
      where: { id },
      data: { is_deleted: true },
    });
  }

  async getTicketTypesByEventId(id: string): Promise<Partial<TicketType>[]> {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event || event.is_deleted) {
      throw createError(404, 'Event not found');
    }

    const ticketTypes = await prisma.ticketType.findMany({
      where: { event_id: id, is_deleted: false },
      select: {
        id: true,
        event_id: true,
        name: true,
        type: true,
        price: true,
        availability: true,
        group_size: true,
      }
    });

    if (ticketTypes.length === 0) {
        throw createError(404, 'No ticket types found');
    }

    return ticketTypes;
  }
}

export default TicketTypeService;
