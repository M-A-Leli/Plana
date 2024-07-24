import { Payment, Prisma } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../config/Prisma.config';
// Import your payment gateway SDK (e.g., Stripe, PayPal)
// import PaymentGateway from '../utils/PaymentGateway';

class PaymentService {
    static async processPayment(data: { order_id: string; amount: number; }): Promise<Partial<Payment> | null> {
        const { order_id, amount } = data;

        const order = await prisma.order.findUnique({
            where: { id: order_id },
        });

        if (!order || order.is_deleted) {
            throw createError(404, 'Order not found');
        }

        //! Interact with the payment gateway to process the payment

        // Store payment details in the database
        const newPayment = await prisma.payment.create({
            data: {
                order_id,
                amount
            },
            select: {
                id: true,
                order_id: true,
                amount: true,
                payment_date: true,
                status: true,
                is_deleted: true
            },
        });

        return newPayment;
    }

    static async verifyPayment(id: string): Promise<Partial<Payment>> {
        const payment = await prisma.payment.findUnique({
            where: { id },
        });

        if (!payment || payment.is_deleted) {
            throw createError(404, 'Payment not found');
        }

        //! Interact with the payment gateway to verify the transaction

        // Update payment status if necessary
        if (payment.status !== 'COMPLETED') {
            const updatedPayment = await prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'COMPLETED' },
                select: {
                    id: true,
                    order_id: true,
                    amount: true,
                    payment_date: true,
                    status: true,
                    is_deleted: true
                },
            });

            return updatedPayment;
        }

        return payment;
    }

    static async getPaymentById(id: string): Promise<Partial<Payment>> {
        const payment = await prisma.payment.findUnique({
            where: { id },
            select: {
                id: true,
                order_id: true,
                amount: true,
                payment_date: true,
                status: true,
                is_deleted: true
            },
        });

        if (!payment || payment.is_deleted) {
            throw createError(404, 'Payment not found');
        }

        return payment;
    }

    static async refundAttendees(eventId: string): Promise<void> {
        const orders = await prisma.order.findMany({
            where: {
                event_id: eventId,
                is_deleted: false
            },
            include: {
                payment: true
            }
        });

        for (const order of orders) {
            if (order.payment && order.payment.status === 'COMPLETED') {
                //! Interact with the payment gateway to refund the amount
            }
        }

        // Mark all tickets as deleted
        await prisma.order.updateMany({
            where: {
                event_id: eventId
            },
            data: {
                is_deleted: true
            }
        });
    }

}

export default PaymentService;
