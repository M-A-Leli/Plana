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
            where: {
                is_deleted: false
            },
            select: {
                id: true,
                username: true,
                email: true,
                phone_number: true,
                profile_img: true
            }
        });

        if (users.length === 0) {
            throw createError(404, 'No users found');
        }

        return users;
    }

    async getUserById(id: string): Promise<Partial<User> | null> {
        const user = await prisma.user.findFirst({
            where: { id, is_deleted: false },
            select: {
                id: true,
                username: true,
                email: true,
                phone_number: true,
                profile_img: true
            }
        });

        if (!user) {
            throw createError(404, 'User not found');
        }

        return user;
    }

    async createUser(data: any, imagePath: string) {
        const {
            username,
            email,
            password,
            phone_number
        } = data;

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

        const phoneNumberExists = await prisma.user.findUnique({
            where: { phone_number: data.phone_number }
        });

        if (phoneNumberExists) {
            throw createError(409, 'Phone number already exists');
        }

        const { hash, salt } = await this.hashPassword(password);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hash,
                salt: salt,
                phone_number,
                profile_img: `${BASE_URL}/images/${imagePath.split('/').pop()}`,
            },
            select: {
                id: true,
                username: true,
                email: true,
                phone_number: true,
                profile_img: true
            }
        });

        return user;
    }

    async updateUser(id: string, data: any, imagePath: string) {
        const {
            username,
            email,
            phone_number
        } = data;

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user || user.is_deleted) {
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

        if (data.phone_number) {
            const existingUserWithPhoneNumber = await prisma.user.findFirst({
                where: {
                    phone_number: data.phone_number,
                    id: { not: user.id },
                },
            });

            if (existingUserWithPhoneNumber) {
                throw createError(409, 'Phone number already exists');
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                username,
                email,
                phone_number,
                profile_img: `${BASE_URL}/images/${imagePath.split('/').pop()}`,
            },
            select: {
                id: true,
                username: true,
                email: true,
                phone_number: true,
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
    }

    async getUserProfile(id: string): Promise<Partial<User> | null> {
        const user = await prisma.user.findFirst({
            where: { id, is_deleted: false },
            select: {
                id: true,
                username: true,
                email: true,
                phone_number: true,
                profile_img: true
            }
        });

        if (!user) {
            throw createError(404, 'User not found');
        }

        return user;
    }

    async updateUserProfile(id: string, data: Partial<User>, imagePath: string): Promise<Partial<User> | null> {
        const {
            username,
            email,
            password,
            phone_number
        } = data;

        const user = await prisma.user.findUnique({ where: { id } });

        if (!user || user.is_deleted) {
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

        if (data.phone_number) {
            const existingUserWithPhoneNumber = await prisma.user.findFirst({
                where: {
                    phone_number: data.phone_number,
                    id: { not: user.id },
                },
            });

            if (existingUserWithPhoneNumber) {
                throw createError(409, 'Phone number already exists');
            }
        }

        //! const { hash, salt } = await this.hashPassword(password);
        const { hash, salt } = await this.hashPassword(password as string);

        const updatedprofile = await prisma.user.update({
            where: { id },
            data: {
                username,
                email,
                password: hash,
                salt: salt,
                phone_number,
                profile_img: `${BASE_URL}/images/${imagePath.split('/').pop()}`,
            },
            select: {
                id: true,
                username: true,
                email: true,
                phone_number: true,
                profile_img: true
            }
        });

        return updatedprofile;
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
}

export default UserService;
