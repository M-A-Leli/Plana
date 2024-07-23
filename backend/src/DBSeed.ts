import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL_DEV as string
        }
    }
});

async function hashPassword(password: string): Promise<{ hash: string, salt: string }> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return { hash, salt };
}

async function main() {
    await prisma.$transaction(async (prisma) => {
        // Seed users
        const { hash, salt } = await hashPassword("Password@123");
        const users = await Promise.all(
            Array.from({ length: 10 }).map((_, i) =>
                prisma.user.create({
                    data: {
                        id: uuidv4(),
                        email: `user${i + 1}@example.com`,
                        password: hash,
                        salt: salt,
                        username: `user${i + 1}`,
                        profile_img: `http://localhost:3000/images/profile${i}.png`,
                        attendees: i >= 4 ? { create: { id: uuidv4(), bio: `Bio for Attendee${i + 1}` } } : undefined,
                        organizers: i >= 1 && i <= 3 ? { create: { id: uuidv4(), company: `Organizer Company${i}`, bio: `Bio for Organizer${i}` } } : undefined,
                        admin: i === 0 ? { create: { id: uuidv4(), level: 1 } } : undefined,
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
                        start_time: new Date().toTimeString(),
                        end_time: new Date().toTimeString(),
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
                                    name: "VVIP",
                                    price: 1000.0,
                                    availability: 50,
                                    group_size: 1,
                                    is_deleted: false,
                                },
                                {
                                    id: uuidv4(),
                                    name: "VIP",
                                    price: 700.0,
                                    availability: 100,
                                    group_size: 1,
                                    is_deleted: false,
                                },
                                {
                                    id: uuidv4(),
                                    name: "REGULAR",
                                    price: 400.0,
                                    availability: 150,
                                    group_size: 1,
                                    is_deleted: false,
                                },
                                {
                                    id: uuidv4(),
                                    name: "VVIP",
                                    price: 1800.0,
                                    availability: 50,
                                    group_size: 2,
                                    is_deleted: false,
                                },
                                {
                                    id: uuidv4(),
                                    name: "VIP",
                                    price: 1200.0,
                                    availability: 100,
                                    group_size: 2,
                                    is_deleted: false,
                                },
                                {
                                    id: uuidv4(),
                                    name: "REGULAR",
                                    price: 1000.0,
                                    availability: 150,
                                    group_size: 3,
                                    is_deleted: false,
                                },
                            ],
                        },
                    },
                    include: {
                        ticket_types: true,
                    },
                });

                // Create orders and tickets for the event
                const attendees = await prisma.attendee.findMany();
                for (const attendee of attendees) {
                    const ticketTypes = event.ticket_types;
                    const ticketsData = ticketTypes.map((ticketType) => ({
                        id: uuidv4(),
                        ticket_type_id: ticketType.id,
                        quantity: Math.floor(Math.random() * 5) + 1, // Random quantity between 1 and 5
                        subtotal: (Math.floor(Math.random() * 5) + 1) * (ticketType.price.toNumber()),
                        unique_code: `TICKET-${uuidv4()}`,
                        is_deleted: false,
                    }));

                    const total = ticketsData.reduce((acc, ticket) => acc + ticket.subtotal, 0);

                    const order = await prisma.order.create({
                        data: {
                            id: uuidv4(),
                            attendee_id: attendee.id,
                            event_id: event.id,
                            total: total,
                            tickets: {
                                create: ticketsData,
                            },
                        },
                    });

                    await prisma.payment.create({
                        data: {
                            id: uuidv4(),
                            order_id: order.id,
                            amount: order.total,
                            payment_date: new Date(),
                            status: "COMPLETED",
                            is_deleted: false,
                        },
                    });

                    // Create reviews for the event
                    await prisma.review.create({
                        data: {
                            id: uuidv4(),
                            attendee_id: attendee.id,
                            event_id: event.id,
                            rating: Math.floor(Math.random() * 5) + 1,
                            comment: `Review for event ${j + 1} by ${attendee.user_id}`,
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
