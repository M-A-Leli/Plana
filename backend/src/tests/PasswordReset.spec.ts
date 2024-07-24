import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { addMinutes } from 'date-fns';
import createError from 'http-errors';
import prisma from '../config/Prisma.config';
import PasswordResetService from '../services/PasswordReset.service';
import sendEmail from '../utils/Email.util';

jest.mock('bcrypt');
jest.mock('crypto', () => ({
    randomBytes: jest.fn(),
}));
jest.mock('date-fns', () => ({
    addMinutes: jest.fn(),
}));
jest.mock('../config/Prisma.config', () => ({
    user: {
        findUnique: jest.fn(),
    },
    passwordResetCode: {
        create: jest.fn(),
        findFirst: jest.fn(),
        updateMany: jest.fn(),
    },
}));
jest.mock('../utils/Email.util', () => jest.fn());

describe('PasswordResetService', () => {
    let passwordResetService: PasswordResetService;

    beforeEach(() => {
        passwordResetService = new PasswordResetService();
        jest.clearAllMocks();
    });

    describe('hashPassword', () => {
        it('should hash a password', async () => {
            const password = 'password123';
            const salt = 'salt';
            const hash = 'hashedPassword';
            (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
            (bcrypt.hash as jest.Mock).mockResolvedValue(hash);

            const result = await passwordResetService.hashPassword(password);

            expect(result).toEqual({ hash, salt });
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
        });
    });

    describe('sendPasswordResetCode', () => {
        it('should send a password reset code', async () => {
            const email = 'user@example.com';
            const user = { id: 'user1', email: 'user@example.com', username: 'username' };
            const resetCode = 'ABC123';
            const expirationTime = new Date();

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (randomBytes as jest.Mock).mockReturnValue(Buffer.from(resetCode));
            (addMinutes as jest.Mock).mockReturnValue(expirationTime);
            (prisma.passwordResetCode.create as jest.Mock).mockResolvedValue({});
            (sendEmail as jest.Mock).mockResolvedValue({});

            await passwordResetService.sendPasswordResetCode(email);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
            expect(prisma.passwordResetCode.create).toHaveBeenCalledWith({
                data: {
                    user_id: user.id,
                    code: resetCode,
                    expires_at: expirationTime,
                },
            });
            expect(sendEmail).toHaveBeenCalledWith({
                to: user.email,
                subject: 'Password Reset Request',
                template: 'PasswordReset',
                context: { username: user.username, resetCode },
            });
        });

        it('should throw a 404 error if the user is not found', async () => {
            const email = 'user@example.com';
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(passwordResetService.sendPasswordResetCode(email)).rejects.toThrow(createError(404, 'User not found'));
        });
    });

    describe('verifyPasswordResetCode', () => {
        it('should verify a password reset code', async () => {
            const code = 'ABC123';
            const passwordReset = { user_id: 'user1' };

            (prisma.passwordResetCode.findFirst as jest.Mock).mockResolvedValue(passwordReset);

            const result = await passwordResetService.verifyPasswordResetCode(code);

            expect(result).toEqual(passwordReset);
            expect(prisma.passwordResetCode.findFirst).toHaveBeenCalledWith({
                where: {
                    code,
                    is_valid: true,
                    expires_at: { gt: new Date() },
                },
                select: {
                    user_id: true
                }
            });
        });

        it('should throw a 400 error if the reset code is invalid or expired', async () => {
            const code = 'INVALID_CODE';
            (prisma.passwordResetCode.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(passwordResetService.verifyPasswordResetCode(code)).rejects.toThrow(createError(400, 'Invalid or expired reset code'));
        });
    });

    describe('resetPassword', () => {
        it('should reset the password and invalidate the reset code', async () => {
            const id = 'user1';
            const newPassword = 'newPassword123';
            const { hash, salt } = { hash: 'newHashedPassword', salt: 'newSalt' };

            (passwordResetService.hashPassword as jest.Mock).mockResolvedValue({ hash, salt });
            (prisma.user.update as jest.Mock).mockResolvedValue({});
            (prisma.passwordResetCode.updateMany as jest.Mock).mockResolvedValue({});

            await passwordResetService.resetPassword(id, newPassword);

            expect(passwordResetService.hashPassword).toHaveBeenCalledWith(newPassword);
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id },
                data: { password: hash, salt },
            });
            expect(prisma.passwordResetCode.updateMany).toHaveBeenCalledWith({
                where: { user_id: id },
                data: { is_valid: false },
            });
        });
    });
});
