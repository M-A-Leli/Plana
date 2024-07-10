// import { PrismaClient } from "@prisma/client";
// import { hash } from "bcryptjs";
// import { v4 as uuidv4 } from "uuid";

// const prisma = new PrismaClient();

// async function main() {
//   await prisma.$transaction(async (prisma) => {
//     // Seed users
//     const hashedPassword = await hash("password123", 10);
//     const users = await Promise.all(
//       Array.from({ length: 10 }).map((_, i) =>
//         prisma.user.create({
//           data: {
//             id: uuidv4(),
//             email: `user${i + 1}@example.com`,
//             password: hashedPassword,
//             salt: "random_salt",
//             username: `user${i + 1}`,
//             phone_number: `1234567890${i}`,
//             profile_img: `https://example.com/profile${i}.png`,
//             attendees: i >= 4 ? { create: { id: uuidv4(), first_name: `Attendee${i + 1}`, last_name: `Last${i + 1}`, bio: `Bio for Attendee${i + 1}` } } : undefined,
//             organizers: i >= 1 && i <= 3 ? { create: { id: uuidv4(), company: `Organizer Company${i}`, bio: `Bio for Organizer${i}` } } : undefined,
//             admin: i === 0 ? { create: { id: uuidv4() } } : undefined,
//           },
//         })
//       )
//     );

//     // Seed events and related data
//     const organizers = await prisma.organizer.findMany();
//     for (const organizer of organizers) {
//       for (let j = 0; j < 5; j++) {
//         const event = await prisma.event.create({
//           data: {
//             id: uuidv4(),
//             organizer_id: organizer.id,
//             title: `Event ${j + 1} by ${organizer.company}`,
//             description: `Description for event ${j + 1} by ${organizer.company}`,
//             date: new Date(),
//             time: new Date(),
//             venue: `Venue ${j + 1}`,
//             is_deleted: false,
//             images: {
//               create: {
//                 id: uuidv4(),
//                 url: `https://example.com/event${j + 1}.png`,
//                 created_at: new Date(),
//                 is_deleted: false,
//               },
//             },
//             ticket_types: {
//               create: [
//                 {
//                   id: uuidv4(),
//                   type: "SINGLE",
//                   price: 20.0,
//                   availability: 100,
//                   is_deleted: false,
//                 },
//                 {
//                   id: uuidv4(),
//                   type: "GROUP",
//                   price: 100.0,
//                   availability: 20,
//                   is_deleted: false,
//                 },
//               ],
//             },
//           },
//         });

//         // Create bookings and payments for the event
//         const attendees = await prisma.attendee.findMany();
//         for (const attendee of attendees) {
//           const ticketType = event.ticket_types[0]; // SINGLE ticket type
//           const ticket = await prisma.ticket.create({
//             data: {
//               id: uuidv4(),
//               ticket_type_id: ticketType.id,
//               unique_code: `TICKET-${uuidv4()}`,
//               is_deleted: false,
//             },
//           });

//           const booking = await prisma.booking.create({
//             data: {
//               id: uuidv4(),
//               attendee_id: attendee.id,
//               ticket_id: ticket.id,
//               status: "CONFIRMED",
//               is_deleted: false,
//             },
//           });

//           await prisma.payment.create({
//             data: {
//               id: uuidv4(),
//               booking_id: booking.id,
//               amount: ticketType.price,
//               payment_date: new Date(),
//               status: "COMPLETED",
//               is_deleted: false,
//             },
//           });

//           // Create reviews for past events
//           await prisma.review.create({
//             data: {
//               id: uuidv4(),
//               user_id: attendee.user_id,
//               event_id: event.id,
//               rating: Math.floor(Math.random() * 5) + 1,
//               created_at: new Date(),
//             },
//           });
//         }
//       }
//     }
//   });
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
