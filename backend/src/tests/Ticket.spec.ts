// import { Prisma, Ticket } from '@prisma/client';
// import createError from 'http-errors';
// import prisma from '../config/Prisma.config';
// import TicketService from '../services/Ticket.service';

// jest.mock('../config/Prisma.config', () => ({
//     ticket: {
//         findMany: jest.fn(),
//         findFirst: jest.fn(),
//         create: jest.fn(),
//         update: jest.fn(),
//         delete: jest.fn(),
//         count: jest.fn(),
//         groupBy: jest.fn(),
//         aggregate: jest.fn(),
//     },
//     order: {
//         findFirst: jest.fn(),
//         findMany: jest.fn(),
//         update: jest.fn(),
//         create: jest.fn(),
//     },
//     user: {
//         findUnique: jest.fn(),
//     },
//     attendee: {
//         findUnique: jest.fn(),
//     },
//     ticketType: {
//         findUnique: jest.fn(),
//     },
//     event: {
//         findUnique: jest.fn(),
//     },
// }));

// describe('TicketService', () => {
//     let ticketService: TicketService;

//     beforeEach(() => {
//         ticketService = new TicketService();
//         jest.clearAllMocks();
//     });

//     describe('getAllTickets', () => {
//         it('should return a list of all tickets', async () => {
//             const tickets = [{ id: '1', unique_code: 'ABC123', quantity: 1, subtotal: 10, is_deleted: false }];
//             (prisma.ticket.findMany as jest.Mock).mockResolvedValue(tickets);

//             const result = await ticketService.getAllTickets();
//             expect(result).toEqual(tickets);
//         });

//         it('should throw a 404 error if no tickets are found', async () => {
//             (prisma.ticket.findMany as jest.Mock).mockResolvedValue([]);

//             await expect(ticketService.getAllTickets()).rejects.toThrow(createError(404, 'No tickets found'));
//         });
//     });

//     describe('getTicketById', () => {
//         it('should return a ticket by id', async () => {
//             const ticket = { id: '1', unique_code: 'ABC123', quantity: 1, subtotal: 10, is_deleted: false };
//             (prisma.ticket.findFirst as jest.Mock).mockResolvedValue(ticket);

//             const result = await ticketService.getTicketById('1');
//             expect(result).toEqual(ticket);
//         });

//         it('should throw a 404 error if the ticket is not found', async () => {
//             (prisma.ticket.findFirst as jest.Mock).mockResolvedValue(null);

//             await expect(ticketService.getTicketById('1')).rejects.toThrow(createError(404, 'Ticket not found'));
//         });

//         it('should throw a 404 error if the ticket is deleted', async () => {
//             const ticket = { id: '1', is_deleted: true };
//             (prisma.ticket.findFirst as jest.Mock).mockResolvedValue(ticket);

//             await expect(ticketService.getTicketById('1')).rejects.toThrow(createError(404, 'Ticket not found'));
//         });
//     });

//     describe('createTicket', () => {
//         it('should create a new ticket and order if no unpaid order exists', async () => {
//             const user = { id: 'user1', is_deleted: false };
//             const attendee = { id: 'attendee1', is_deleted: false };
//             const ticketType = { id: 'type1', price: new Prisma.Decimal(10), event_id: 'event1', is_deleted: false };

//             (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
//             (prisma.attendee.findUnique as jest.Mock).mockResolvedValue(attendee);
//             (prisma.ticketType.findUnique as jest.Mock).mockResolvedValue(ticketType);
//             (prisma.order.findFirst as jest.Mock).mockResolvedValue(null);

//             const newOrder = { id: 'order1' };
//             const newTicket = { id: 'ticket1', unique_code: 'XYZ789', quantity: 1, subtotal: 10 };

//             (prisma.$transaction as jest.Mock).mockImplementation(async (tx: any) => {
//                 return [newOrder, newTicket];
//             });

//             const result = await ticketService.createTicket('user1', {
//                 ticket_type_id: 'type1',
//                 quantity: 1,
//                 subtotal: new Prisma.Decimal(10),
//                 unique_code: 'XYZ789',
//                 is_deleted: false,
//             });

//             expect(result).toEqual(newTicket);
//         });

//         it('should update an existing ticket if an unpaid order exists', async () => {
//             const user = { id: 'user1', is_deleted: false };
//             const attendee = { id: 'attendee1', is_deleted: false };
//             const ticketType = { id: 'type1', price: new Prisma.Decimal(10), event_id: 'event1', is_deleted: false };
//             const unpaidOrder = { id: 'order1', total: new Prisma.Decimal(10) };

//             (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
//             (prisma.attendee.findUnique as jest.Mock).mockResolvedValue(attendee);
//             (prisma.ticketType.findUnique as jest.Mock).mockResolvedValue(ticketType);
//             (prisma.order.findFirst as jest.Mock).mockResolvedValue(unpaidOrder);

//             const existingTicket = { id: 'ticket1', quantity: 1, subtotal: new Prisma.Decimal(10) };
//             (prisma.ticket.findFirst as jest.Mock).mockResolvedValue(existingTicket);

//             const updatedTicket = { id: 'ticket1', quantity: 2, subtotal: new Prisma.Decimal(20) };

//             (prisma.$transaction as jest.Mock).mockImplementation(async (tx: any) => {
//                 return [updatedTicket];
//             });

//             const result = await ticketService.createTicket('user1', {
//                 ticket_type_id: 'type1',
//                 quantity: 2,
//                 subtotal: new Prisma.Decimal(20),
//                 unique_code: 'XYZ789',
//                 is_deleted: false,
//             });

//             expect(result).toEqual(updatedTicket);
//         });
//     });

//     describe('updateTicket', () => {
//         it('should update a ticket', async () => {
//             const ticket = { id: '1', unique_code: 'ABC123', quantity: 1, subtotal: 10, is_deleted: false, order: { total: new Prisma.Decimal(10) } };
//             const ticketType = { id: '1', price: new Prisma.Decimal(10), availability: 10 };

//             (prisma.ticket.findUnique as jest.Mock).mockResolvedValue(ticket);
//             (prisma.ticketType.findUnique as jest.Mock).mockResolvedValue(ticketType);

//             const updatedTicket = { id: '1', unique_code: 'ABC123', quantity: 2, subtotal: 20, is_deleted: false };

//             (prisma.$transaction as jest.Mock).mockImplementation(async (tx: any) => {
//                 return updatedTicket;
//             });

//             const result = await ticketService.updateTicket('1', { quantity: 2, subtotal: new Prisma.Decimal(20) });

//             expect(result).toEqual(updatedTicket);
//         });

//         it('should throw a 404 error if the ticket or ticket type is not found', async () => {
//             (prisma.ticket.findUnique as jest.Mock).mockResolvedValue(null);

//             await expect(ticketService.updateTicket('1', { quantity: 2 })).rejects.toThrow(createError(404, 'Ticket not found'));
//         });

//         it('should throw a 400 error if the ticket type is unavailable', async () => {
//             const ticket = { id: '1', unique_code: 'ABC123', quantity: 1, subtotal: 10, is_deleted: false };
//             const ticketType = { id: '1', availability: 0 };

//             (prisma.ticket.findUnique as jest.Mock).mockResolvedValue(ticket);
//             (prisma.ticketType.findUnique as jest.Mock).mockResolvedValue(ticketType);

//             await expect(ticketService.updateTicket('1', { quantity: 2 })).rejects.toThrow(createError(400, 'Ticket type unavailable'));
//         });
//     });

//     describe('deleteTicket', () => {
//         it('should delete a ticket', async () => {
//             const ticket = { id: '1', is_deleted: false, order_id: 'order1', subtotal: new Prisma.Decimal(10), order: { payment_id: null, total: new Prisma.Decimal(10) } };

//             (prisma.ticket.findUnique as jest.Mock).mockResolvedValue(ticket);

//             await ticketService.deleteTicket('1');

//             expect(prisma.ticket.update).toHaveBeenCalledWith({
//                 where: { id: '1' },
//                 data: { is_deleted: true },
//             });

//             expect(prisma.order.update).toHaveBeenCalledWith({
//                 where: { id: 'order1' },
//                 data: { total: new Prisma.Decimal(0) },
//             });
//         });

//         it('should throw a 404 error if the ticket is not found', async () => {
//             (prisma.ticket.findUnique as jest.Mock).mockResolvedValue(null);

//             await expect(ticketService.deleteTicket('1')).rejects.toThrow(createError(404, 'Ticket not found'));
//         });
//     });

//     describe('validateTicket', () => {
//         it('should return a valid ticket', async () => {
//             const ticket = { id: '1', unique_code: 'ABC123', quantity: 1, subtotal: 10, is_deleted: false };

//             (prisma.ticket.findFirst as jest.Mock).mockResolvedValue(ticket);

//             const result = await ticketService.validateTicket('ABC123');
//             expect(result).toEqual(ticket);
//         });

//         it('should throw a 400 error if the ticket is invalid', async () => {
//             (prisma.ticket.findFirst as jest.Mock).mockResolvedValue(null);

//             await expect(ticketService.validateTicket('INVALID')).rejects.toThrow(createError(400, 'Invalid ticket'));
//         });
//     });
// });
