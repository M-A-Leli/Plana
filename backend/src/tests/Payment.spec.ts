import createError from 'http-errors';
import prisma from '../config/Prisma.config';
import PaymentService from '../services/Payment.service';
// import PaymentGateway from '../utils/PaymentGateway';

jest.mock('../config/Prisma.config', () => ({
    order: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        updateMany: jest.fn(),
    },
    payment: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
    },
}));

// Mock PaymentGateway if it's being used
// jest.mock('../utils/PaymentGateway', () => ({
//     processPayment: jest.fn(),
//     verifyPayment: jest.fn(),
//     refundPayment: jest.fn(),
// }));

describe('PaymentService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('processPayment', () => {
        it('should process a payment and store payment details', async () => {
            const order_id = 'order1';
            const amount = 100;
            const order = { id: order_id, is_deleted: false };
            const newPayment = { id: 'payment1', order_id, amount, payment_date: new Date(), status: 'PENDING', is_deleted: false };

            (prisma.order.findUnique as jest.Mock).mockResolvedValue(order);
            // Mock the payment gateway interaction if necessary
            // (PaymentGateway.processPayment as jest.Mock).mockResolvedValue(true);
            (prisma.payment.create as jest.Mock).mockResolvedValue(newPayment);

            const result = await PaymentService.processPayment({ order_id, amount });

            expect(result).toEqual(newPayment);
            expect(prisma.order.findUnique).toHaveBeenCalledWith({ where: { id: order_id } });
            // expect(PaymentGateway.processPayment).toHaveBeenCalledWith({ order_id, amount });
            expect(prisma.payment.create).toHaveBeenCalledWith({
                data: {
                    order_id,
                    amount,
                },
                select: {
                    id: true,
                    order_id: true,
                    amount: true,
                    payment_date: true,
                    status: true,
                    is_deleted: true,
                },
            });
        });

        it('should throw a 404 error if the order is not found', async () => {
            const order_id = 'order1';
            const amount = 100;

            (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(PaymentService.processPayment({ order_id, amount })).rejects.toThrow(createError(404, 'Order not found'));
        });

        it('should throw a 404 error if the order is deleted', async () => {
            const order_id = 'order1';
            const amount = 100;
            const order = { id: order_id, is_deleted: true };

            (prisma.order.findUnique as jest.Mock).mockResolvedValue(order);

            await expect(PaymentService.processPayment({ order_id, amount })).rejects.toThrow(createError(404, 'Order not found'));
        });
    });

    describe('verifyPayment', () => {
        it('should verify a payment and update status if necessary', async () => {
            const id = 'payment1';
            const payment = { id, status: 'PENDING', is_deleted: false };
            const updatedPayment = { id, status: 'COMPLETED', is_deleted: false };

            (prisma.payment.findUnique as jest.Mock).mockResolvedValue(payment);
            // Mock the payment gateway interaction if necessary
            // (PaymentGateway.verifyPayment as jest.Mock).mockResolvedValue(true);
            (prisma.payment.update as jest.Mock).mockResolvedValue(updatedPayment);

            const result = await PaymentService.verifyPayment(id);

            expect(result).toEqual(updatedPayment);
            expect(prisma.payment.findUnique).toHaveBeenCalledWith({ where: { id } });
            // expect(PaymentGateway.verifyPayment).toHaveBeenCalledWith(id);
            expect(prisma.payment.update).toHaveBeenCalledWith({
                where: { id },
                data: { status: 'COMPLETED' },
                select: {
                    id: true,
                    order_id: true,
                    amount: true,
                    payment_date: true,
                    status: true,
                    is_deleted: true,
                },
            });
        });

        it('should return the payment if status is already COMPLETED', async () => {
            const id = 'payment1';
            const payment = { id, status: 'COMPLETED', is_deleted: false };

            (prisma.payment.findUnique as jest.Mock).mockResolvedValue(payment);

            const result = await PaymentService.verifyPayment(id);

            expect(result).toEqual(payment);
            expect(prisma.payment.findUnique).toHaveBeenCalledWith({ where: { id } });
        });

        it('should throw a 404 error if the payment is not found', async () => {
            const id = 'payment1';

            (prisma.payment.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(PaymentService.verifyPayment(id)).rejects.toThrow(createError(404, 'Payment not found'));
        });

        it('should throw a 404 error if the payment is deleted', async () => {
            const id = 'payment1';
            const payment = { id, is_deleted: true };

            (prisma.payment.findUnique as jest.Mock).mockResolvedValue(payment);

            await expect(PaymentService.verifyPayment(id)).rejects.toThrow(createError(404, 'Payment not found'));
        });
    });

    describe('getPaymentById', () => {
        it('should retrieve a payment by ID', async () => {
            const id = 'payment1';
            const payment = { id, order_id: 'order1', amount: 100, payment_date: new Date(), status: 'COMPLETED', is_deleted: false };

            (prisma.payment.findUnique as jest.Mock).mockResolvedValue(payment);

            const result = await PaymentService.getPaymentById(id);

            expect(result).toEqual(payment);
            expect(prisma.payment.findUnique).toHaveBeenCalledWith({
                where: { id },
                select: {
                    id: true,
                    order_id: true,
                    amount: true,
                    payment_date: true,
                    status: true,
                    is_deleted: true,
                },
            });
        });

        it('should throw a 404 error if the payment is not found', async () => {
            const id = 'payment1';

            (prisma.payment.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(PaymentService.getPaymentById(id)).rejects.toThrow(createError(404, 'Payment not found'));
        });

        it('should throw a 404 error if the payment is deleted', async () => {
            const id = 'payment1';
            const payment = { id, is_deleted: true };

            (prisma.payment.findUnique as jest.Mock).mockResolvedValue(payment);

            await expect(PaymentService.getPaymentById(id)).rejects.toThrow(createError(404, 'Payment not found'));
        });
    });

    describe('refundAttendees', () => {
        it('should refund attendees and mark orders as deleted', async () => {
            const eventId = 'event1';
            const orders = [
                { id: 'order1', event_id: eventId, is_deleted: false, payment: { status: 'COMPLETED' } },
                { id: 'order2', event_id: eventId, is_deleted: false, payment: { status: 'PENDING' } }
            ];

            (prisma.order.findMany as jest.Mock).mockResolvedValue(orders);
            // Mock the payment gateway refund if necessary
            // (PaymentGateway.refundPayment as jest.Mock).mockResolvedValue(true);
            (prisma.order.updateMany as jest.Mock).mockResolvedValue({});

            await PaymentService.refundAttendees(eventId);

            // Expect payment gateway refund to be called for completed payments
            // expect(PaymentGateway.refundPayment).toHaveBeenCalledWith({ id: 'order1', amount: payment.amount });
            expect(prisma.order.updateMany).toHaveBeenCalledWith({
                where: { event_id: eventId },
                data: { is_deleted: true },
            });
        });
    });
});
