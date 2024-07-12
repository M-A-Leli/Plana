import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL_DEV as string
        }
    }
});

async function main() {
    await prisma.$transaction(async (prisma) => {
        // Seed users
        const hashedPassword = await hash("password123", 10);
        const users = await Promise.all(
            Array.from({ length: 10 }).map((_, i) =>
                prisma.user.create({
                    data: {
                        id: uuidv4(),
                        email: `user${i + 1}@example.com`,
                        password: hashedPassword,
                        salt: "random_salt", //!
                        username: `user${i + 1}`,
                        phone_number: `070000000${i}`,
                        profile_img: `http://localhost:3000/images/profile${i}.png`,
                        attendees: i >= 4 ? { create: { id: uuidv4(), first_name: `Attendee${i + 1}`, last_name: `Last${i + 1}`, bio: `Bio for Attendee${i + 1}` } } : undefined,
                        organizers: i >= 1 && i <= 3 ? { create: { id: uuidv4(), company: `Organizer Company${i}`, bio: `Bio for Organizer${i}` } } : undefined,
                        admin: i === 0 ? { create: { id: uuidv4() } } : undefined,
                    },
                })
            )
        );

        // Seed events and related data
        const organizers = await prisma.organizer.findMany();
        for (const organizer of organizers) {
            for (let j = 0; j < 5; j++) {
                const event = await prisma.event.create({
                    data: {
                        id: uuidv4(),
                        organizer_id: organizer.id,
                        title: `Event ${j + 1} by ${organizer.company}`,
                        description: `Description for event ${j + 1} by ${organizer.company}`,
                        date: new Date(),
                        time: new Date(),
                        venue: `Venue ${j + 1}`,
                        is_deleted: false,
                        images: {
                            create: {
                                id: uuidv4(),
                                url: `https://localhost:3000/images/event${j + 1}.jpeg`,
                                created_at: new Date(),
                                is_deleted: false,
                            },
                        },
                        ticket_types: {
                            create: [
                                {
                                    id: uuidv4(),
                                    name: "Regular Ticket",
                                    type: "SINGLE",
                                    price: 20.0,
                                    availability: 100,
                                    is_deleted: false,
                                },
                                {
                                    id: uuidv4(),
                                    name: "Group Ticket",
                                    type: "GROUP",
                                    price: 100.0,
                                    availability: 20,
                                    group_size: 5,
                                    is_deleted: false,
                                },
                            ],
                        },
                    },
                    include: {
                        ticket_types: true,
                    },
                });

                // Create tickets for the event
                const attendees = await prisma.attendee.findMany();
                for (const attendee of attendees) {
                    const ticketType = event.ticket_types[0]; // SINGLE ticket type
                    const ticket = await prisma.ticket.create({
                        data: {
                            id: uuidv4(),
                            ticket_type_id: ticketType.id,
                            attendee_id: attendee.id,
                            event_id: event.id,
                            unique_code: `TICKET-${uuidv4()}`,
                            is_deleted: false,
                        },
                    });

                    await prisma.payment.create({
                        data: {
                            id: uuidv4(),
                            ticket_id: ticket.id,
                            amount: ticketType.price,
                            payment_date: new Date(),
                            status: "COMPLETED",
                            is_deleted: false,
                        },
                    });

                    // Create reviews for past events
                    await prisma.review.create({
                        data: {
                            id: uuidv4(),
                            attendee_id: attendee.id,
                            event_id: event.id,
                            rating: Math.floor(Math.random() * 5) + 1,
                            comment: `Review for event ${j + 1} by ${attendee.first_name}`,
                            is_deleted: false,
                            created_at: new Date(),
                        },
                    });
                }
            }
        }
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
