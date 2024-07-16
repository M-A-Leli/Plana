import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { User, Prisma } from '@prisma/client';
import prisma from '../config/Prisma.config';

const BASE_URL = `http://localhost:${process.env.PORT}`;

class UserService {
    async hashPassword(password: string): Promise<{ hash: string, salt: string }> {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return { hash, salt };
    }

    async getAllUsers(): Promise<Partial<User>[]> {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                profile_img: true,
                admin: {
                    select: {
                        id: true,
                    }
                },
                organizers: {
                    select: {
                        id: true,
                    }
                },
                attendees: {
                    select: {
                        id: true,
                    }
                }
            }
        });

        if (users.length === 0) {
            throw createError(404, 'No users found');
        }

        return users;
    }

    async getUserById(id: string): Promise<Partial<User> | null> {
        const user = await prisma.user.findFirst({
            where: { id, is_deleted: false, is_suspended: false },
            select: {
                id: true,
                username: true,
                email: true,
                profile_img: true,
                admin: {
                    select: {
                        id: true,
                    }
                },
                organizers: {
                    select: {
                        id: true,
                    }
                },
                attendees: {
                    select: {
                        id: true,
                    }
                }
            }
        });

        if (!user) {
            throw createError(404, 'User not found');
        }

        return user;
    }

    async createUser(data: Partial<User>, imagePath: string): Promise<Partial<User> | null> {
        const {
            username,
            email,
            password
        } = data;

        if (!username || !email || !password) {
            throw createError(400, 'Username, email, and password are required');
        }

        const emailExists = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (emailExists) {
            throw createError(409, 'Email already exists');
        }

        const usernameExits = await prisma.user.findUnique({
            where: { username: data.username }
        });

        if (usernameExits) {
            throw createError(409, 'Username already exists');
        }

        const { hash, salt } = await this.hashPassword(password as string);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hash,
                salt: salt,
                profile_img: `${BASE_URL}/images/${imagePath.split('/').pop()}`,
            },
            select: {
                id: true,
                username: true,
                email: true,
                profile_img: true
            }
        });

        const attendee = await prisma.attendee.create({
            data: {
                user_id: user.id
            }
        });

        return user;
    }

    async updateUser(id: string, data: Partial<User>, imagePath: string): Promise<Partial<User> | null> {
        const {
            username,
            email
        } = data;

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user || user.is_deleted || user.is_suspended) {
            throw createError(404, 'User not found');
        }

        if (data.email) {
            const existingUserWithEmail = await prisma.user.findFirst({
                where: {
                    email: data.email,
                    id: { not: user.id },
                },
            });

            if (existingUserWithEmail) {
                throw createError(409, 'Email already exists');
            }
        }

        if (data.username) {
            const existingUserWithUsername = await prisma.user.findFirst({
                where: {
                    username: data.username,
                    id: { not: user.id },
                },
            });

            if (existingUserWithUsername) {
                throw createError(409, 'Username already exists');
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                username,
                email,
                profile_img: `${BASE_URL}/images/${imagePath.split('/').pop()}`,
            },
            select: {
                id: true,
                username: true,
                email: true,
                profile_img: true
            }
        });

        return updatedUser;
    }

    async deleteUser(id: string) {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user || user.is_deleted) {
            throw createError(404, 'User not found');
        }

        await prisma.user.update({
            where: { id },
            data: { is_deleted: true }
        });

        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: user.id },
                data: { is_deleted: true }
            });

            const attendee = await tx.attendee.findUnique({ where: { user_id: user.id } });
            if (attendee) {
                await tx.attendee.update({
                    where: { user_id: user.id },
                    data: { is_deleted: true }
                });
            }

            const organizer = await tx.organizer.findUnique({ where: { user_id: user.id } });
            if (organizer) {
                await tx.organizer.update({
                    where: { user_id: user.id },
                    data: { is_deleted: true }
                });
            }

            const admin = await tx.admin.findUnique({ where: { user_id: user.id } });
            if (admin) {
                await tx.admin.update({
                    where: { user_id: user.id },
                    data: { is_deleted: true }
                });
            }
        }).catch((error) => {
            throw createError(500, `Error deleting user: ${error.message}`);
        });
    }

    async getUserProfile(id: string): Promise<Partial<User> | null> {
        const user = await prisma.user.findFirst({
            where: { id, is_deleted: false, is_suspended: false },
            select: {
                id: true,
                username: true,
                email: true,
                profile_img: true,
                admin: {
                    select: {
                        id: true,
                    }
                },
                organizers: {
                    select: {
                        id: true,
                    }
                },
                attendees: {
                    select: {
                        id: true,
                    }
                }
            }
        });

        if (!user) {
            throw createError(404, 'User not found');
        }

        return user;
    }

    async updateUserProfile(id: string, data: Partial<User>): Promise<Partial<User> | null> {
        const {
            username,
            email
        } = data;

        const user = await prisma.user.findUnique({ where: { id } });

        if (!user || user.is_deleted || user.is_suspended) {
            throw createError(404, 'User not found');
        }

        if (data.email) {
            const existingUserWithEmail = await prisma.user.findFirst({
                where: {
                    email: data.email,
                    id: { not: user.id },
                },
            });

            if (existingUserWithEmail) {
                throw createError(409, 'Email already exists');
            }
        }

        if (data.username) {
            const existingUserWithUsername = await prisma.user.findFirst({
                where: {
                    username: data.username,
                    id: { not: user.id },
                },
            });

            if (existingUserWithUsername) {
                throw createError(409, 'Username already exists');
            }
        }

        const updatedprofile = await prisma.user.update({
            where: { id },
            data: {
                username,
                email
            },
            select: {
                id: true,
                username: true,
                email: true,
                profile_img: true
            }
        });

        return updatedprofile;
    }

    async getUserProfileImage(id: string): Promise<String | null> {
        const user = await prisma.user.findFirst({
            where: { id, is_deleted: false, is_suspended: false },
            select: {
                profile_img: true
            }
        });

        if (!user) {
            throw createError(404, 'User not found');
        }

        return user.profile_img;
    }

    async updateUserProfileImage(id: string, imagePath: string): Promise<String | null> {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user || user.is_deleted || user.is_suspended) {
            throw createError(404, 'User not found');
        }

        const updatedprofile = await prisma.user.update({
            where: { id },
            data: {
                profile_img: `${BASE_URL}/images/${imagePath.split('/').pop()}`,
            },
            select: {
                profile_img: true
            }
        });

        return updatedprofile.profile_img;
    }

    async suspendUser(id: string) {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user || user.is_deleted) {
            throw createError(404, 'User not found');
        }

        if (user.is_suspended) {
            throw createError(400, 'User is already suspended');
        }

        await prisma.user.update({
            where: { id },
            data: { is_suspended: true }
        });
    }

    async getActiveUsers(): Promise<Partial<User>[]> {
        const users = await prisma.user.findMany({
            where: {
                is_deleted: false,
                is_suspended: false
            },
            select: {
                id: true,
                username: true,
                email: true,
                profile_img: true,
                admin: {
                    select: {
                        id: true,
                    }
                },
                organizers: {
                    select: {
                        id: true,
                    }
                },
                attendees: {
                    select: {
                        id: true,
                    }
                }
            }
        });

        if (users.length === 0) {
            throw createError(404, 'No active users found');
        }

        return users;
    }

    async getSuspendedUsers(): Promise<Partial<User>[]> {
        const users = await prisma.user.findMany({
            where: {
                is_suspended: true
            },
            select: {
                id: true,
                username: true,
                email: true,
                profile_img: true,
                admin: {
                    select: {
                        id: true,
                    }
                },
                organizers: {
                    select: {
                        id: true,
                    }
                },
                attendees: {
                    select: {
                        id: true,
                    }
                }
            }
        });

        if (users.length === 0) {
            throw createError(404, 'No suspended users found');
        }

        return users;
    }

    async getDeletedUsers(): Promise<Partial<User>[]> {
        const users = await prisma.user.findMany({
            where: {
                is_deleted: true
            },
            select: {
                id: true,
                username: true,
                email: true,
                profile_img: true,
                admin: {
                    select: {
                        id: true,
                    }
                },
                organizers: {
                    select: {
                        id: true,
                    }
                },
                attendees: {
                    select: {
                        id: true,
                    }
                }
            }
        });

        if (users.length === 0) {
            throw createError(404, 'No deleted users found');
        }

        return users;
    }

    async getUserAnalytics(): Promise<Object> {
        const all_users = await prisma.user.count();

        const active_users = await prisma.user.count({
            where: {
                is_deleted: false,
                is_suspended: false,
            },
        });

        const deleted_users = await prisma.user.count({
            where: { is_deleted: true },
        });

        const suspended_users = await prisma.user.count({
            where: { is_suspended: true },
        });

        // ! More analytics

        return {
            all_users,
            active_users,
            deleted_users,
            suspended_users,
        };
    }
}

export default UserService;
