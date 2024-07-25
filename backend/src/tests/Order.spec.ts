import { Prisma } from '@prisma/client';
import prisma from '../config/Prisma.config';
import OrderService from '../services/Order.service';

jest.mock('../config/Prisma.config', () => ({
    order: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        groupBy: jest.fn(),
    },
    user: {
        findUnique: jest.fn(),
    },
    attendee: {
        findUnique: jest.fn(),
    },
    event: {
        findUnique: jest.fn(),
    },
    payment: {
        aggregate: jest.fn(),
    },
}));

jest.mock('../services/Payment.service');
jest.mock('../utils/Email.util');

describe('OrderService', () => {
    const orderService = new OrderService();

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllOrders', () => {
        it('should return all orders', async () => {
            const orders = [{ id: '1', attendee_id: '1', event_id: '1', total: 100, payment_id: '1', is_deleted: false, updated_at: new Date() }];
            (prisma.order.findMany as jest.Mock).mockResolvedValue(orders);

            const result = await orderService.getAllOrders();
            expect(result).toEqual(orders);
        });

        it('should throw an error if no orders found', async () => {
            (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

            await expect(orderService.getAllOrders()).rejects.toThrow('No orders found');
        });
    });

    describe('getPaidOrders', () => {
        it('should return paid orders', async () => {
            const orders = [{ id: '1', attendee_id: '1', event_id: '1', total: 100, payment_id: '1', is_deleted: false, updated_at: new Date() }];
            (prisma.order.findMany as jest.Mock).mockResolvedValue(orders);

            const result = await orderService.getPaidOrders();
            expect(result).toEqual(orders);
        });

        it('should throw an error if no paid orders found', async () => {
            (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

            await expect(orderService.getPaidOrders()).rejects.toThrow('No orders found');
        });
    });

    describe('getUnpaidOrders', () => {
        it('should return unpaid orders', async () => {
            const orders = [{ id: '1', attendee_id: '1', event_id: '1', total: 100, payment_id: null, is_deleted: false, updated_at: new Date() }];
            (prisma.order.findMany as jest.Mock).mockResolvedValue(orders);

            const result = await orderService.getUnpaidOrders();
            expect(result).toEqual(orders);
        });

        it('should throw an error if no unpaid orders found', async () => {
            (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

            await expect(orderService.getUnpaidOrders()).rejects.toThrow('No orders found');
        });
    });

    describe('getDeletedOrders', () => {
        it('should return deleted orders', async () => {
            const orders = [{ id: '1', attendee_id: '1', event_id: '1', total: 100, payment_id: '1', is_deleted: true, updated_at: new Date() }];
            (prisma.order.findMany as jest.Mock).mockResolvedValue(orders);

            const result = await orderService.getDeletedOrders();
            expect(result).toEqual(orders);
        });

        it('should throw an error if no deleted orders found', async () => {
            (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

            await expect(orderService.getDeletedOrders()).rejects.toThrow('No orders found');
        });
    });

    describe('getOrderById', () => {
        it('should return the order by id', async () => {
            const order = { id: '1', attendee_id: '1', event_id: '1', total: 100, payment_id: '1', is_deleted: false, updated_at: new Date() };
            (prisma.order.findUnique as jest.Mock).mockResolvedValue(order);

            const result = await orderService.getOrderById('1');
            expect(result).toEqual(order);
        });

        it('should throw an error if the order is not found', async () => {
            (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(orderService.getOrderById('1')).rejects.toThrow('Order not found');
        });
    });

    describe('createOrder', () => {
        it('should create a new order', async () => {
            const user = { id: '1', is_deleted: false, is_suspended: false };
            const attendee = { id: '1', user_id: '1', is_deleted: false };
            const event = { id: '1', is_deleted: false };
            const orderData = { event_id: '1', total: 100 };
            const createdOrder = { id: '1', attendee_id: '1', event_id: '1', total: 100, payment_id: null, is_deleted: false, updated_at: new Date() };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.attendee.findUnique as jest.Mock).mockResolvedValue(attendee);
            (prisma.event.findUnique as jest.Mock).mockResolvedValue(event);
            (prisma.order.findFirst as jest.Mock).mockResolvedValue(null);
            (prisma.order.create as jest.Mock).mockResolvedValue(createdOrder);

            const result = await orderService.createOrder('1', orderData);
            expect(result).toEqual(createdOrder);
        });

        it('should throw an error if the user is not found', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(orderService.createOrder('1', { event_id: '1', total: 100 })).rejects.toThrow('User not found');
        });

        it('should throw an error if the attendee is not found', async () => {
            const user = { id: '1', is_deleted: false, is_suspended: false };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.attendee.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(orderService.createOrder('1', { event_id: '1', total: 100 })).rejects.toThrow('Attendee not found');
        });

        it('should throw an error if the event is not found', async () => {
            const user = { id: '1', is_deleted: false, is_suspended: false };
            const attendee = { id: '1', user_id: '1', is_deleted: false };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.attendee.findUnique as jest.Mock).mockResolvedValue(attendee);
            (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(orderService.createOrder('1', { event_id: '1', total: 100 })).rejects.toThrow('Event not found');
        });

        it('should throw an error if there is a pending order', async () => {
            const user = { id: '1', is_deleted: false, is_suspended: false };
            const attendee = { id: '1', user_id: '1', is_deleted: false };
            const event = { id: '1', is_deleted: false };
            const pendingOrder = { id: '2', attendee_id: '1', event_id: '1', total: 100, payment_id: null, is_deleted: false, updated_at: new Date() };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.attendee.findUnique as jest.Mock).mockResolvedValue(attendee);
            (prisma.event.findUnique as jest.Mock).mockResolvedValue(event);
            (prisma.order.findFirst as jest.Mock).mockResolvedValue(pendingOrder);

            await expect(orderService.createOrder('1', { event_id: '1', total: 100 })).rejects.toThrow('There is already a pending order for this user and event');
        });
    });

    describe('updateOrder', () => {
        it('should update an order', async () => {
            const order = { id: '1', attendee_id: '1', event_id: '1', total: 100, payment_id: null, is_deleted: false, updated_at: new Date() };
            const updatedOrder = { ...order, total: 200 };

            (prisma.order.findUnique as jest.Mock).mockResolvedValue(order);
            (prisma.order.update as jest.Mock).mockResolvedValue(updatedOrder);

            const result = await orderService.updateOrder('1', { total: new Prisma.Decimal(200) });
            expect(result).toEqual(updatedOrder);
        });

        it('should throw an error if the order is not found', async () => {
            (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(orderService.updateOrder('1', { total: new Prisma.Decimal(200) })).rejects.toThrow('Order not found');
        });
    });

    describe('deleteOrder', () => {
        it('should mark an order as deleted', async () => {
            const order = { id: '1', attendee_id: '1', event_id: '1', total: 100, payment_id: null, is_deleted: false, updated_at: new Date() };
            const deletedOrder = { ...order, is_deleted: true };

            (prisma.order.findUnique as jest.Mock).mockResolvedValue(order);
            (prisma.order.update as jest.Mock).mockResolvedValue(deletedOrder);

            const result = await orderService.deleteOrder('1');
            expect(result).toEqual(deletedOrder);
        });

        it('should throw an error if the order is not found', async () => {
            (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(orderService.deleteOrder('1')).rejects.toThrow('Order not found');
        });
    });
});
