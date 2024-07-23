import { PrismaClient, Order } from '@prisma/client';
import createError from 'http-errors';
import prisma from '../config/Prisma.config';
import PaymentService from './Payment.service';
import sendEmail from '../utils/Email.util';

class OrderService {
    async getAllOrders(): Promise<Partial<Order>[]> {
        const orders = await prisma.order.findMany({
            select: {
                id: true,
                attendee_id: true,
                event_id: true,
                total: true,
                payment_id: true,
                is_deleted: true,
                updated_at: true
            }
        });

        if (orders.length === 0) {
            throw createError(404, 'No orders found');
        }

        return orders;
    }

    async getPaidOrders(): Promise<Partial<Order>[]> {
        const orders = await prisma.order.findMany({
            where: {
                payment_id: { not: null },
                is_deleted: false
            },
            select: {
                id: true,
                attendee_id: true,
                event_id: true,
                total: true,
                payment_id: true,
                is_deleted: true,
                updated_at: true
            }
        });

        if (orders.length === 0) {
            throw createError(404, 'No orders found');
        }

        return orders;
    }

    async getUnpaidOrders(): Promise<Partial<Order>[]> {
        const orders = await prisma.order.findMany({
            where: { payment_id: null, is_deleted: false },
            select: {
                id: true,
                attendee_id: true,
                event_id: true,
                total: true,
                payment_id: true,
                is_deleted: true,
                updated_at: true
            }
        });

        if (orders.length === 0) {
            throw createError(404, 'No orders found');
        }

        return orders;
    }

    async getDeletedOrders(): Promise<Partial<Order>[]> {
        const orders = await prisma.order.findMany({
            where: { is_deleted: true },
            select: {
                id: true,
                attendee_id: true,
                event_id: true,
                total: true,
                payment_id: true,
                is_deleted: true,
                updated_at: true
            }
        });

        if (orders.length === 0) {
            throw createError(404, 'No orders found');
        }

        return orders;
    }

    async getOrderById(id: string): Promise<Partial<Order>> {
        const order = await prisma.order.findUnique({
            where: { id, is_deleted: false },
            select: {
                id: true,
                attendee_id: true,
                event_id: true,
                total: true,
                payment_id: true,
                is_deleted: true,
                updated_at: true
            }
        });

        if (!order) {
            throw createError(404, 'Order not found');
        }

        return order;
    }

    async createOrder(userId: string, data: { event_id: string; total: number; }): Promise<Partial<Order>> {
        const { event_id, total } = data;

        const user = await prisma.user.findUnique({
            where: { id: userId, is_deleted: false }
        });

        if (!user || user.is_deleted || user.is_suspended) {
            throw createError(404, "User not found");
        }

        const attendee = await prisma.attendee.findUnique({
            where: { user_id: user.id, is_deleted: false }
        });

        if (!attendee || attendee.is_deleted) {
            throw createError(404, "Attendee not found");
        }

        const event = await prisma.event.findUnique({
            where: { id: event_id, is_deleted: false }
        });

        if (!event || event.is_deleted) {
            throw createError(404, "Event not found");
        }

        const pendingOrder = await prisma.order.findFirst({
            where: {
                attendee_id: attendee.id,
                event_id: event_id,
                is_deleted: false,
                payment_id: null
            }
        });

        if (pendingOrder) {
            throw createError(400, 'There is already a pending order for this user and event');
        }

        const order = await prisma.order.create({
            data: {
                attendee_id: user.id,
                event_id: data.event_id,
                total: total,
            },
            select: {
                id: true,
                attendee_id: true,
                event_id: true,
                total: true,
                payment_id: true,
                is_deleted: true,
                updated_at: true
            }
        });

        return order;
    }

    async updateOrder(id: string, data: Partial<Order>): Promise<Partial<Order>> {
        const order = await prisma.order.findUnique({
            where: { id },
        });

        if (!order || order.is_deleted) {
            throw createError(404, 'Order not found');
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data,
            select: {
                id: true,
                attendee_id: true,
                event_id: true,
                total: true,
                payment_id: true,
                is_deleted: true,
                updated_at: true
            }
        });

        return updatedOrder;
    }

    async deleteOrder(id: string): Promise<void> {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                payment: true,
                event: true
            }
        });

        if (!order || order.is_deleted) {
            throw createError(404, 'Order not found');
        }

        if (order.payment) {
            const currentDateTime = new Date();
            const eventStartDateTime = new Date(order.event.date);
            const [startHours, startMinutes] = order.event.start_time.split(':').map(Number);
            eventStartDateTime.setHours(startHours, startMinutes);

            if (currentDateTime < eventStartDateTime) {
                //! Placeholder for refund logic
                // await paymentService.refund(order.payment.id);
            }
        }

        await prisma.order.update({
            where: { id },
            data: { is_deleted: true },
        }).catch((error) => {
            throw createError(500, `Error deleting order: ${error.message}`);
        });
    }

    async getOrdersByUserId(userId: string): Promise<Partial<Order>[]> {
        const user = await prisma.user.findUnique({
            where: { id: userId, is_deleted: false }
        });

        if (!user || user.is_deleted || user.is_suspended) {
            throw createError(404, "User not found");
        }

        const attendee = await prisma.attendee.findUnique({
            where: { user_id: user.id, is_deleted: false }
        });

        if (!attendee || attendee.is_deleted) {
            throw createError(404, "Attendee not found");
        }

        const orders = await prisma.order.findMany({
            where: { attendee_id: attendee.id, is_deleted: false },
            select: {
                id: true,
                attendee_id: true,
                event_id: true,
                total: true,
                payment_id: true,
                is_deleted: true,
                updated_at: true
            }
        });

        if (orders.length === 0) {
            throw createError(404, 'No orders found for this user');
        }

        return orders;
    }

    async getUnpaidOrderByUserId(userId: string): Promise<Partial<Order> | null> {
        const user = await prisma.user.findUnique({
            where: { id: userId, is_deleted: false }
        });

        if (!user || user.is_deleted || user.is_suspended) {
            throw createError(404, "User not found");
        }

        const attendee = await prisma.attendee.findUnique({
            where: { user_id: user.id, is_deleted: false }
        });

        if (!attendee || attendee.is_deleted) {
            throw createError(404, "Attendee not found");
        }

        const order = await prisma.order.findFirst({
            where: { attendee_id: attendee.id, is_deleted: false, payment_id: null },
            select: {
                id: true,
                attendee_id: true,
                event_id: true,
                total: true,
                payment_id: true,
                is_deleted: true,
                updated_at: true
            }
        });

        if (!order) {
            throw createError(404, 'No unpaid order found for this user');
        }

        return order;
    }

    async getPaidOrdersByUserId(userId: string): Promise<Partial<Order>[]> {
        const user = await prisma.user.findUnique({
            where: { id: userId, is_deleted: false }
        });

        if (!user || user.is_deleted || user.is_suspended) {
            throw createError(404, "User not found");
        }

        const attendee = await prisma.attendee.findUnique({
            where: { user_id: user.id, is_deleted: false }
        });

        if (!attendee || attendee.is_deleted) {
            throw createError(404, "Attendee not found");
        }

        const orders = await prisma.order.findMany({
            where: { attendee_id: attendee.id, is_deleted: false, payment_id: { not: null } },
            select: {
                id: true,
                attendee_id: true,
                event_id: true,
                total: true,
                payment_id: true,
                is_deleted: true,
                updated_at: true
            }
        });

        if (orders.length === 0) {
            throw createError(404, 'No paid orders found for this user');
        }

        return orders;
    }

    async checkoutOrder(userId: string): Promise<Partial<Order>> {
        const user = await prisma.user.findUnique({
            where: { id: userId, is_deleted: false }
        });

        if (!user || user.is_deleted || user.is_suspended) {
            throw createError(404, "User not found");
        }

        const attendee = await prisma.attendee.findUnique({
            where: { user_id: user.id, is_deleted: false }
        });

        if (!attendee || attendee.is_deleted) {
            throw createError(404, "Attendee not found");
        }

        const pendingOrder = await prisma.order.findFirst({
            where: {
                attendee_id: attendee.id,
                is_deleted: false,
                payment_id: null,
            },
            include: {
                tickets: true
            }
        });

        if (!pendingOrder) {
            throw createError(404, 'No pending order found for this user');
        }

        if (pendingOrder.tickets.length === 0) {
            throw createError(400, 'Cannot checkout an order with no tickets');
        }

        // !
        const payment = await PaymentService.processPayment({ order_id: pendingOrder.id, amount: pendingOrder.total.toNumber() });

        // !
        await PaymentService.verifyPayment(payment?.id as string);

        const updatedOrder = await prisma.order.update({
            where: { id: pendingOrder.id },
            data: {
                payment_id: payment?.id,
                updated_at: new Date()
            },
            select: {
                id: true,
                attendee_id: true,
                event_id: true,
                total: true,
                payment_id: true,
                is_deleted: true,
                updated_at: true,
                tickets: {
                    include: {
                        ticket_type: true
                    }
                }
            }
        });

        const event = await prisma.event.findUnique
            ({ where: { id: pendingOrder.event_id } });

        await sendEmail({
            to: user.email,
            subject: 'Your Order Receipt',
            template: 'OrderReceipt',
            context: {
                order_id: pendingOrder.id,
                username: user.username,
                event: event?.title,
                date: new Date().toLocaleString(),
                tickets: pendingOrder.tickets,
                total: pendingOrder.total
            }
        });

        return updatedOrder;
    }

    async getOrderAnalytics(): Promise<Object> {
        const all_orders = await prisma.order.count();

        const active_orders = await prisma.order.count({
            where: {
                is_deleted: false
            },
        });

        const deleted_orders = await prisma.order.count({
            where: { is_deleted: true },
        });

        const paid_orders = await prisma.order.count({
            where: {
                payment_id: {
                    not: null
                },
                is_deleted: false
            },
        });

        const unpaid_orders = await prisma.order.count({
            where: {
                payment_id: null,
                is_deleted: false
            },
        });

        const total_payment_amount = await prisma.payment.aggregate({
            _sum: {
                amount: true
            },
            where: {
                is_deleted: false
            }
        });

        const average_order_value = await prisma.order.aggregate({
            _avg: {
                total: true
            },
            where: {
                is_deleted: false
            }
        });

        const orders_per_event = await prisma.order.groupBy({
            by: ['event_id'],
            _count: {
                id: true
            },
            where: {
                is_deleted: false
            }
        });

        const orders_per_user = await prisma.order.groupBy({
            by: ['attendee_id'],
            _count: {
                id: true
            },
            where: {
                is_deleted: false
            }
        });

        // const orders_per_month = await prisma.order.groupBy({
        //     by: [prisma.$sql`DATE_FORMAT(created_at, '%Y-%m')`],
        //     _count: {
        //         id: true
        //     },
        //     where: {
        //         is_deleted: false
        //     }
        // });

        // Orders per month
        const orders = await prisma.order.findMany({
            where: {
                is_deleted: false
            },
            select: {
                created_at: true
            }
        });

        const orders_per_month = orders.reduce((acc: any, order) => {
            const month = order.created_at.toISOString().slice(0, 7); // Extract YYYY-MM
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});

        return {
            all_orders,
            active_orders,
            deleted_orders,
            paid_orders,
            unpaid_orders,
            total_payment_amount: total_payment_amount._sum.amount,
            average_order_value: average_order_value._avg.total,
            orders_per_event,
            orders_per_user,
            orders_per_month
        };
    }
}

export default OrderService;
