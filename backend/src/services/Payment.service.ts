// import { Payment, Prisma } from '@prisma/client';
// import createError from 'http-errors';
// import prisma from '../config/Prisma.config';
// // Import your payment gateway SDK (e.g., Stripe, PayPal)
// import PaymentGateway from '../utils/PaymentGateway'; // Placeholder for actual payment gateway import

// class PaymentService {
//     async processPayment(data: Prisma.PaymentCreateInput): Promise<Partial<Payment>> {
//         // Validate booking
//         const booking = await prisma.booking.findUnique({
//             where: { id: data.booking_id },
//         });

//         if (!booking) {
//             throw createError(404, 'Booking not found');
//         }

//         // Interact with the payment gateway to process the payment
//         const paymentResult = await PaymentGateway.processPayment({
//             amount: data.amount,
//             currency: 'USD', // or any other currency
//             source: data.payment_source, // e.g., credit card details
//             description: `Payment for booking ${data.booking_id}`,
//         });

//         if (!paymentResult.success) {
//             throw createError(400, 'Payment failed');
//         }

//         // Store payment details in the database
//         const newPayment = await prisma.payment.create({
//             data: {
//                 ...data,
//                 transaction_id: paymentResult.transaction_id,
//                 status: 'COMPLETED',
//             },
//             select: {
//                 id: true,
//                 booking_id: true,
//                 amount: true,
//                 currency: true,
//                 transaction_id: true,
//                 status: true,
//                 created_at: true,
//                 updated_at: true,
//             },
//         });

//         return newPayment;
//     }

//     async verifyPayment(transaction_id: string): Promise<Partial<Payment>> {
//         const payment = await prisma.payment.findUnique({
//             where: { transaction_id },
//             select: {
//                 id: true,
//                 booking_id: true,
//                 amount: true,
//                 currency: true,
//                 transaction_id: true,
//                 status: true,
//                 created_at: true,
//                 updated_at: true,
//             },
//         });

//         if (!payment) {
//             throw createError(404, 'Payment not found');
//         }

//         // Interact with the payment gateway to verify the transaction
//         const verificationResult = await PaymentGateway.verifyTransaction(transaction_id);

//         if (!verificationResult.success) {
//             throw createError(400, 'Payment verification failed');
//         }

//         // Update payment status if necessary
//         if (payment.status !== 'COMPLETED') {
//             const updatedPayment = await prisma.payment.update({
//                 where: { id: payment.id },
//                 data: { status: 'COMPLETED' },
//                 select: {
//                     id: true,
//                     booking_id: true,
//                     amount: true,
//                     currency: true,
//                     transaction_id: true,
//                     status: true,
//                     created_at: true,
//                     updated_at: true,
//                 },
//             });

//             return updatedPayment;
//         }

//         return payment;
//     }

//     async getPaymentById(id: string): Promise<Partial<Payment>> {
//         const payment = await prisma.payment.findUnique({
//             where: { id },
//             select: {
//                 id: true,
//                 booking_id: true,
//                 amount: true,
//                 currency: true,
//                 transaction_id: true,
//                 status: true,
//                 created_at: true,
//                 updated_at: true,
//             },
//         });

//         if (!payment) {
//             throw createError(404, 'Payment not found');
//         }

//         return payment;
//     }

//     async getPaymentsByUserId(user_id: string): Promise<Partial<Payment>[]> {
//         const payments = await prisma.payment.findMany({
//             where: { user_id },
//             select: {
//                 id: true,
//                 booking_id: true,
//                 amount: true,
//                 currency: true,
//                 transaction_id: true,
//                 status: true,
//                 created_at: true,
//                 updated_at: true,
//             },
//         });

//         if (payments.length === 0) {
//             throw createError(404, 'No payments found');
//         }

//         return payments;
//     }

//     async getPaymentsByEventId(event_id: string): Promise<Partial<Payment>[]> {
//         const bookings = await prisma.booking.findMany({
//             where: { event_id },
//             select: {
//                 payments: {
//                     select: {
//                         id: true,
//                         booking_id: true,
//                         amount: true,
//                         currency: true,
//                         transaction_id: true,
//                         status: true,
//                         created_at: true,
//                         updated_at: true,
//                     },
//                 },
//             },
//         });

//         const payments = bookings.flatMap(booking => booking.payments);

//         if (payments.length === 0) {
//             throw createError(404, 'No payments found');
//         }

//         return payments;
//     }
    // async function refundAttendees(eventId: string): Promise<void> {
    //     const tickets = await prisma.ticket.findMany({
    //         where: {
    //             event_id: eventId,
    //             is_deleted: false
    //         },
    //         include: {
    //             Payment: true
    //         }
    //     });

    //     for (const ticket of tickets) {
    //         if (ticket.Payment && ticket.Payment.status === 'COMPLETED') {
    //             // Logic to process refund
    //             // This can include calling a payment gateway API to refund the amount
    //         }
    //     }

    //     // Mark all tickets as deleted
    //     await prisma.ticket.updateMany({
    //         where: {
    //             event_id: eventId
    //         },
    //         data: {
    //             is_deleted: true
    //         }
    //     });
    // }

// }

// export default PaymentService;
