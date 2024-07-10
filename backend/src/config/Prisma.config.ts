import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

const createPrismaClient = (): PrismaClient => {
    switch (process.env.NODE_ENV) {
        case 'production':
            return new PrismaClient({
                datasources: {
                    db: {
                        url: process.env.DATABASE_URL_PROD as string,
                    },
                },
            });
        case 'test':
            return new PrismaClient({
                datasources: {
                    db: {
                        url: process.env.DATABASE_URL_TEST as string,
                    },
                },
            });
        default:
            return new PrismaClient({
                datasources: {
                    db: {
                        url: process.env.DATABASE_URL_DEV as string,
                    },
                },
            });
    }
};

// Initialize the prisma client
prisma = createPrismaClient();

export default prisma;
