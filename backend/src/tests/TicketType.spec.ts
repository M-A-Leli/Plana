import createError from 'http-errors';
import prisma from '../config/Prisma.config';
import TicketTypeService from '../services/TicketType.service';
import { Prisma } from '@prisma/client';

jest.mock('../config/Prisma.config', () => ({
    ticketType: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
    event: {
        findUnique: jest.fn(),
    },
}));

describe('TicketTypeService', () => {
    const ticketTypeService = new TicketTypeService();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllTicketTypes', () => {
        it('should retrieve all non-deleted ticket types', async () => {
            const ticketTypes = [
                { id: 'ticket1', event_id: 'event1', name: 'Standard', price: 50, availability: 100, group_size: 1 }
            ];

            (prisma.ticketType.findMany as jest.Mock).mockResolvedValue(ticketTypes);

            const result = await ticketTypeService.getAllTicketTypes();

            expect(result).toEqual(ticketTypes);
            expect(prisma.ticketType.findMany).toHaveBeenCalledWith({
                where: { is_deleted: false },
                select: {
                    id: true,
                    event_id: true,
                    name: true,
                    price: true,
                    availability: true,
                    group_size: true,
                },
            });
        });

        it('should throw a 404 error if no ticket types are found', async () => {
            (prisma.ticketType.findMany as jest.Mock).mockResolvedValue([]);

            await expect(ticketTypeService.getAllTicketTypes()).rejects.toThrow(createError(404, 'No ticket types found'));
        });
    });

    describe('getTicketTypeById', () => {
        it('should retrieve a ticket type by ID', async () => {
            const ticketType = { id: 'ticket1', event_id: 'event1', name: 'Standard', price: 50, availability: 100, group_size: 1 };

            (prisma.ticketType.findFirst as jest.Mock).mockResolvedValue(ticketType);

            const result = await ticketTypeService.getTicketTypeById('ticket1');

            expect(result).toEqual(ticketType);
            expect(prisma.ticketType.findFirst).toHaveBeenCalledWith({
                where: { id: 'ticket1', is_deleted: false },
                select: {
                    id: true,
                    event_id: true,
                    name: true,
                    price: true,
                    availability: true,
                    group_size: true,
                },
            });
        });

        it('should throw a 404 error if the ticket type is not found', async () => {
            (prisma.ticketType.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(ticketTypeService.getTicketTypeById('ticket1')).rejects.toThrow(createError(404, 'TicketType not found'));
        });
    });

    describe('createTicketType', () => {
        it('should create a new ticket type', async () => {
            const data = { event_id: 'event1', name: 'Standard', price: new Prisma.Decimal(50), availability: 100, group_size: 1, is_deleted: false, created_at: new Date(), updated_at: new Date() };
            const event = { id: 'event1', is_deleted: false };
            const newTicketType = { id: 'ticket1', ...data };

            (prisma.event.findUnique as jest.Mock).mockResolvedValue(event);
            (prisma.ticketType.create as jest.Mock).mockResolvedValue(newTicketType);

            const result = await ticketTypeService.createTicketType(data);

            expect(result).toEqual(newTicketType);
            expect(prisma.event.findUnique).toHaveBeenCalledWith({ where: { id: data.event_id } });
            expect(prisma.ticketType.create).toHaveBeenCalledWith({
                data,
                select: {
                    id: true,
                    event_id: true,
                    name: true,
                    price: true,
                    availability: true,
                    group_size: true,
                },
            });
        });

        it('should throw a 404 error if the event is not found', async () => {
            const data = { event_id: 'event1', name: 'Standard', price: new Prisma.Decimal(50), availability: 100, group_size: 1, is_deleted: false, created_at: new Date(), updated_at: new Date() };

            (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(ticketTypeService.createTicketType(data)).rejects.toThrow(createError(404, 'Event not found'));
        });

        it('should throw a 404 error if the event is deleted', async () => {
            const data = { event_id: 'event1', name: 'Standard', price: new Prisma.Decimal(50), availability: 100, group_size: 1, is_deleted: false, created_at: new Date(), updated_at: new Date() };
            const event = { id: 'event1', is_deleted: true };

            (prisma.event.findUnique as jest.Mock).mockResolvedValue(event);

            await expect(ticketTypeService.createTicketType(data)).rejects.toThrow(createError(404, 'Event not found'));
        });
    });

    describe('updateTicketType', () => {
        it('should update a ticket type', async () => {
            const id = 'ticket1';
            const data = { price: new Prisma.Decimal(55) };
            const ticketType = { id, event_id: 'event1', name: 'Standard', price: 50, availability: 100, group_size: 1 };
            const updatedTicketType = { id, event_id: 'event1', name: 'Standard', price: 55, availability: 100, group_size: 1 };

            (prisma.ticketType.findUnique as jest.Mock).mockResolvedValue(ticketType);
            (prisma.ticketType.update as jest.Mock).mockResolvedValue(updatedTicketType);

            const result = await ticketTypeService.updateTicketType(id, data);

            expect(result).toEqual(updatedTicketType);
            expect(prisma.ticketType.findUnique).toHaveBeenCalledWith({ where: { id } });
            expect(prisma.ticketType.update).toHaveBeenCalledWith({
                where: { id },
                data,
                select: {
                    id: true,
                    event_id: true,
                    name: true,
                    price: true,
                    availability: true,
                    group_size: true,
                },
            });
        });

        it('should throw a 404 error if the ticket type is not found', async () => {
            const id = 'ticket1';
            const data = { price: new Prisma.Decimal(55) };

            (prisma.ticketType.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(ticketTypeService.updateTicketType(id, data)).rejects.toThrow(createError(404, 'TicketType not found'));
        });

        it('should throw a 404 error if the ticket type is deleted', async () => {
            const id = 'ticket1';
            const data = { price: new Prisma.Decimal(55) };
            const ticketType = { id, is_deleted: true };

            (prisma.ticketType.findUnique as jest.Mock).mockResolvedValue(ticketType);

            await expect(ticketTypeService.updateTicketType(id, data)).rejects.toThrow(createError(404, 'TicketType not found'));
        });
    });

    describe('deleteTicketType', () => {
        it('should delete a ticket type if no purchased tickets are present', async () => {
            const id = 'ticket1';
            const ticketType = { id, is_deleted: false, tickets: [] };

            (prisma.ticketType.findUnique as jest.Mock).mockResolvedValue(ticketType);
            (prisma.ticketType.update as jest.Mock).mockResolvedValue({ ...ticketType, is_deleted: true });

            await ticketTypeService.deleteTicketType(id);

            expect(prisma.ticketType.findUnique).toHaveBeenCalledWith({
                where: { id },
                include: {
                    tickets: { where: { is_deleted: false } },
                },
            });
            expect(prisma.ticketType.update).toHaveBeenCalledWith({
                where: { id },
                data: { is_deleted: true },
            });
        });

        it('should throw a 400 error if the ticket type has purchased tickets', async () => {
            const id = 'ticket1';
            const ticketType = { id, is_deleted: false, tickets: [{ id: 'ticketA', is_deleted: false }] };

            (prisma.ticketType.findUnique as jest.Mock).mockResolvedValue(ticketType);

            await expect(ticketTypeService.deleteTicketType(id)).rejects.toThrow(createError(400, 'Ticket type cannot be deleted as it has purchased tickets'));
        });

        it('should throw a 404 error if the ticket type is not found', async () => {
            const id = 'ticket1';

            (prisma.ticketType.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(ticketTypeService.deleteTicketType(id)).rejects.toThrow(createError(404, 'Ticket type not found'));
        });
    });

    describe('getTicketTypesByEventId', () => {
        it('should retrieve ticket types by event ID', async () => {
            const event = { id: 'event1', is_deleted: false };
            const ticketTypes = [
                { id: 'ticket1', event_id: 'event1', name: 'Standard', price: 50, availability: 100, group_size: 1 },
                // Add more ticket type objects as needed
            ];

            (prisma.event.findUnique as jest.Mock).mockResolvedValue(event);
            (prisma.ticketType.findMany as jest.Mock).mockResolvedValue(ticketTypes);

            const result = await ticketTypeService.getTicketTypesByEventId('event1');

            expect(result).toEqual(ticketTypes);
            expect(prisma.event.findUnique).toHaveBeenCalledWith({ where: { id: 'event1' } });
            expect(prisma.ticketType.findMany).toHaveBeenCalledWith({
                where: { event_id: 'event1', is_deleted: false },
                select: {
                    id: true,
                    event_id: true,
                    name: true,
                    price: true,
                    availability: true,
                    group_size: true,
                },
            });
        });

        it('should throw a 404 error if no ticket types are found for the event', async () => {
            const event = { id: 'event1', is_deleted: false };

            (prisma.event.findUnique as jest.Mock).mockResolvedValue(event);
            (prisma.ticketType.findMany as jest.Mock).mockResolvedValue([]);

            await expect(ticketTypeService.getTicketTypesByEventId('event1')).rejects.toThrow(createError(404, 'No ticket types found'));
        });

        it('should throw a 404 error if the event is not found', async () => {
            (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(ticketTypeService.getTicketTypesByEventId('event1')).rejects.toThrow(createError(404, 'Event not found'));
        });

        it('should throw a 404 error if the event is deleted', async () => {
            const event = { id: 'event1', is_deleted: true };

            (prisma.event.findUnique as jest.Mock).mockResolvedValue(event);

            await expect(ticketTypeService.getTicketTypesByEventId('event1')).rejects.toThrow(createError(404, 'Event not found'));
        });
    });
});
