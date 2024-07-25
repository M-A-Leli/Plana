import UserService from '../services/User.service';
import prisma from '../config/Prisma.config';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import sendEmail from '../utils/Email.util';

jest.mock('../config/Prisma.config');
jest.mock('../utils/Email.util');
jest.mock('bcrypt');

describe('UserService', () => {
    let userService: UserService;
    const BASE_URL = `http://localhost:${process.env.PORT}`;

    beforeEach(() => {
        userService = new UserService();
    });

    describe('hashPassword', () => {
        it('should hash the password correctly', async () => {
            const password = 'password123';
            const salt = 'salt';
            const hash = 'hashedPassword';

            (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
            (bcrypt.hash as jest.Mock).mockResolvedValue(hash);

            const result = await userService.hashPassword(password);

            expect(result).toEqual({ hash, salt });
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
        });
    });

    describe('generatePassword', () => {
        it('should generate a password of the default length', () => {
            const password = UserService.generatePassword();
            expect(password).toHaveLength(12);
            // Add more checks as needed
        });

        it('should generate a password of a specified length', () => {
            const length = 16;
            const password = UserService.generatePassword(length);
            expect(password).toHaveLength(length);
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const users = [
                { id: 'user1', username: 'user1', email: 'user1@example.com', profile_img: '', is_deleted: false, is_suspended: false },
                { id: 'user2', username: 'user2', email: 'user2@example.com', profile_img: '', is_deleted: false, is_suspended: false }
            ];

            (prisma.user.findMany as jest.Mock).mockResolvedValue(users);

            const result = await userService.getAllUsers();

            expect(result).toEqual(users);
            expect(prisma.user.findMany).toHaveBeenCalledWith({
                select: {
                    id: true,
                    username: true,
                    email: true,
                    profile_img: true,
                    is_deleted: true,
                    is_suspended: true,
                    admin: { select: { id: true } },
                    organizers: { select: { id: true } },
                    attendees: { select: { id: true } }
                }
            });
        });

        it('should throw a 404 error if no users are found', async () => {
            (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

            await expect(userService.getAllUsers()).rejects.toThrow(createError(404, 'No users found'));
        });
    });

    describe('getUserById', () => {
        it('should return a user by ID', async () => {
            const user = {
                id: 'user1',
                username: 'user1',
                email: 'user1@example.com',
                profile_img: '',
                is_deleted: false,
                is_suspended: false
            };

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(user);

            const result = await userService.getUserById('user1');

            expect(result).toEqual(user);
            expect(prisma.user.findFirst).toHaveBeenCalledWith({
                where: { id: 'user1', is_deleted: false, is_suspended: false },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    profile_img: true,
                    is_deleted: true,
                    is_suspended: true,
                    admin: { select: { id: true } },
                    organizers: { select: { id: true } },
                    attendees: { select: { id: true } }
                }
            });
        });

        it('should throw a 404 error if user not found', async () => {
            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(userService.getUserById('nonexistent')).rejects.toThrow(createError(404, 'User not found'));
        });
    });

    describe('createUser', () => {
        it('should create a new user and send a welcome email', async () => {
            const newUser = {
                id: 'user1',
                username: 'user1',
                email: 'user1@example.com',
                profile_img: `${BASE_URL}/images/default_profile_image.svg`
            };

            const generatedPassword = 'newPassword123';
            const hash = 'hashedPassword';
            const salt = 'salt';

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.user.create as jest.Mock).mockResolvedValue(newUser);
            (prisma.attendee.create as jest.Mock).mockResolvedValue({});
            (userService.hashPassword as jest.Mock).mockResolvedValue({ hash, salt });
            (sendEmail as jest.Mock).mockResolvedValue({});

            const result = await userService.createUser({ username: 'user1', email: 'user1@example.com' });

            expect(result).toEqual(newUser);
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    username: 'user1',
                    email: 'user1@example.com',
                    password: hash,
                    salt: salt,
                    profile_img: `${BASE_URL}/images/default_profile_image.svg`
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    profile_img: true
                }
            });
            expect(sendEmail).toHaveBeenCalledWith({
                to: 'user1@example.com',
                subject: 'Welcome to Plana',
                template: 'WelcomeUser',
                context: {
                    username: 'user1',
                    email: 'user1@example.com',
                    password: generatedPassword,
                    loginUrl: `http://localhost:4200/login`
                }
            });
        });

        it('should throw a 400 error if username or email is missing', async () => {
            await expect(userService.createUser({ username: 'user1' })).rejects.toThrow(createError(400, 'Username, email, and password are required'));
            await expect(userService.createUser({ email: 'user1@example.com' })).rejects.toThrow(createError(400, 'Username, email, and password are required'));
        });

        it('should throw a 409 error if email already exists', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ email: 'user1@example.com' });

            await expect(userService.createUser({ username: 'user1', email: 'user1@example.com' })).rejects.toThrow(createError(409, 'Email already exists'));
        });

        it('should throw a 409 error if username already exists', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ username: 'user1' });

            await expect(userService.createUser({ username: 'user1', email: 'user2@example.com' })).rejects.toThrow(createError(409, 'Username already exists'));
        });
    });

    describe('updateUser', () => {
        it('should update user details', async () => {
            const existingUser = {
                id: 'user1',
                username: 'user1',
                email: 'user1@example.com',
                is_deleted: false,
                is_suspended: false
            };

            const updatedUser = {
                id: 'user1',
                username: 'updatedUser',
                email: 'updated@example.com'
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
            (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

            const result = await userService.updateUser('user1', { username: 'updatedUser', email: 'updated@example.com' });

            expect(result).toEqual(updatedUser);
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 'user1' },
                data: {
                    username: 'updatedUser',
                    email: 'updated@example.com',
                    updated_at: expect.any(Date)
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    profile_img: true
                }
            });
        });

        it('should throw a 404 error if user not found or is inactive', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(userService.updateUser('nonexistent', { username: 'updatedUser' })).rejects.toThrow(createError(404, 'User not found'));

            (prisma.user.findUnique as jest.Mock).mockResolvedValue({
                id: 'user1',
                is_deleted: true
            });

            await expect(userService.updateUser('user1', { username: 'updatedUser' })).rejects.toThrow(createError(404, 'User not found'));
        });

        it('should throw a 409 error if email already exists', async () => {
            const existingUser = {
                id: 'user1',
                username: 'user1',
                email: 'user1@example.com',
                is_deleted: false,
                is_suspended: false
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
            (prisma.user.findFirst as jest.Mock).mockResolvedValue({ email: 'updated@example.com' });

            await expect(userService.updateUser('user1', { email: 'updated@example.com' })).rejects.toThrow(createError(409, 'Email already exists'));
        });

        it('should throw a 409 error if username already exists', async () => {
            const existingUser = {
                id: 'user1',
                username: 'user1',
                email: 'user1@example.com',
                is_deleted: false,
                is_suspended: false
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
            (prisma.user.findFirst as jest.Mock).mockResolvedValue({ username: 'existingUser' });

            await expect(userService.updateUser('user1', { username: 'existingUser' })).rejects.toThrow(createError(409, 'Username already exists'));
        });
    });

    describe('deleteUser', () => {
        it('should delete a user and associated records', async () => {
            const user = {
                id: 'user1',
                is_deleted: false
            };

            const attendee = { user_id: 'user1' };
            const organizer = { user_id: 'user1' };
            const admin = { user_id: 'user1' };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
                await callback(prisma);
            });

            await userService.deleteUser('user1');

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 'user1' },
                data: { is_deleted: true }
            });
        });

        it('should throw a 404 error if user not found', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(userService.deleteUser('nonexistent')).rejects.toThrow(createError(404, 'User not found'));
        });
    });

    describe('getUserProfile', () => {
        it('should return a user profile by ID', async () => {
            const userProfile = {
                id: 'user1',
                username: 'user1',
                email: 'user1@example.com',
                profile_img: ''
            };

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(userProfile);

            const result = await userService.getUserProfile('user1');

            expect(result).toEqual(userProfile);
        });

        it('should throw a 404 error if user profile not found', async () => {
            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(userService.getUserProfile('nonexistent')).rejects.toThrow(createError(404, 'User not found'));
        });
    });

    describe('updateUserProfile', () => {
        it('should update a user profile', async () => {
            const existingUser = {
                id: 'user1',
                username: 'user1',
                email: 'user1@example.com',
                is_deleted: false,
                is_suspended: false
            };

            const updatedProfile = {
                id: 'user1',
                username: 'updatedUser',
                email: 'updated@example.com'
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
            (prisma.user.update as jest.Mock).mockResolvedValue(updatedProfile);

            const result = await userService.updateUserProfile('user1', { username: 'updatedUser', email: 'updated@example.com' });

            expect(result).toEqual(updatedProfile);
        });

        it('should throw a 404 error if user profile not found or is inactive', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(userService.updateUserProfile('nonexistent', { username: 'updatedUser' })).rejects.toThrow(createError(404, 'User not found'));

            (prisma.user.findUnique as jest.Mock).mockResolvedValue({
                id: 'user1',
                is_deleted: true
            });

            await expect(userService.updateUserProfile('user1', { username: 'updatedUser' })).rejects.toThrow(createError(404, 'User not found'));
        });

        it('should throw a 409 error if email already exists', async () => {
            const existingUser = {
                id: 'user1',
                username: 'user1',
                email: 'user1@example.com',
                is_deleted: false,
                is_suspended: false
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
            (prisma.user.findFirst as jest.Mock).mockResolvedValue({ email: 'updated@example.com' });

            await expect(userService.updateUserProfile('user1', { email: 'updated@example.com' })).rejects.toThrow(createError(409, 'Email already exists'));
        });

        it('should throw a 409 error if username already exists', async () => {
            const existingUser = {
                id: 'user1',
                username: 'user1',
                email: 'user1@example.com',
                is_deleted: false,
                is_suspended: false
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
            (prisma.user.findFirst as jest.Mock).mockResolvedValue({ username: 'existingUser' });

            await expect(userService.updateUserProfile('user1', { username: 'existingUser' })).rejects.toThrow(createError(409, 'Username already exists'));
        });
    });

    describe('getUserProfileImage', () => {
        it('should return the profile image of a user by ID', async () => {
            const user = {
                id: 'user1',
                profile_img: `${BASE_URL}/images/profile_image.svg`
            };

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(user);

            const result = await userService.getUserProfileImage('user1');

            expect(result).toEqual(user.profile_img);
        });

        it('should throw a 404 error if user not found', async () => {
            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(userService.getUserProfileImage('nonexistent')).rejects.toThrow(createError(404, 'User not found'));
        });
    });

    describe('updateUserProfileImage', () => {
        it('should update the profile image of a user', async () => {
            const user = {
                id: 'user1',
                profile_img: `${BASE_URL}/images/old_profile_image.svg`
            };

            const newProfileImage = `${BASE_URL}/images/new_profile_image.svg`;

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.user.update as jest.Mock).mockResolvedValue({ profile_img: newProfileImage });

            const result = await userService.updateUserProfileImage('user1', 'new_profile_image.svg');

            expect(result).toEqual(newProfileImage);
        });

        it('should throw a 404 error if user not found', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(userService.updateUserProfileImage('nonexistent', 'image.svg')).rejects.toThrow(createError(404, 'User not found'));
        });

        it('should throw a 404 error if user is inactive', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({
                id: 'user1',
                is_deleted: true
            });

            await expect(userService.updateUserProfileImage('user1', 'image.svg')).rejects.toThrow(createError(404, 'User not found'));
        });
    });

    describe('suspendUser', () => {
        it('should suspend a user and send a suspension email', async () => {
            const user = {
                id: 'user1',
                username: 'user1',
                email: 'user1@example.com',
                is_deleted: false,
                is_suspended: false
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.user.update as jest.Mock).mockResolvedValue({
                ...user,
                is_suspended: true
            });
            (sendEmail as jest.Mock).mockResolvedValue({});

            await userService.suspendUser('user1');

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 'user1' },
                data: { is_suspended: true }
            });
            expect(sendEmail).toHaveBeenCalledWith({
                to: 'user1@example.com',
                subject: 'Account Suspension Notice',
                template: 'UserSuspension',
                context: { username: 'user1' }
            });
        });

        it('should throw a 404 error if user not found', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(userService.suspendUser('nonexistent')).rejects.toThrow(createError(404, 'User not found'));
        });

        it('should throw a 400 error if user is already suspended', async () => {
            const user = {
                id: 'user1',
                is_suspended: true
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

            await expect(userService.suspendUser('user1')).rejects.toThrow(createError(400, 'User is already suspended'));
        });
    });

    describe('reinstateUser', () => {
        it('should reinstate a suspended user and send a reinstatement email', async () => {
            const user = {
                id: 'user1',
                username: 'user1',
                email: 'user1@example.com',
                is_suspended: true
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.user.update as jest.Mock).mockResolvedValue({
                ...user,
                is_suspended: false
            });
            (sendEmail as jest.Mock).mockResolvedValue({});

            await userService.reinstateUser('user1');

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 'user1' },
                data: { is_suspended: false }
            });
            expect(sendEmail).toHaveBeenCalledWith({
                to: 'user1@example.com',
                subject: 'Account Reinstatement Notice',
                template: 'UserReinstatement',
                context: { username: 'user1' }
            });
        });

        it('should throw a 404 error if user not found', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(userService.reinstateUser('nonexistent')).rejects.toThrow(createError(404, 'User not found'));
        });

        it('should throw a 400 error if user is not suspended', async () => {
            const user = {
                id: 'user1',
                is_suspended: false
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

            await expect(userService.reinstateUser('user1')).rejects.toThrow(createError(400, 'User is not suspended'));
        });
    });

    describe('getActiveUsers', () => {
        it('should return all active users', async () => {
            const activeUsers = [
                { id: 'user1', username: 'user1', email: 'user1@example.com' },
                { id: 'user2', username: 'user2', email: 'user2@example.com' }
            ];

            (prisma.user.findMany as jest.Mock).mockResolvedValue(activeUsers);

            const result = await userService.getActiveUsers();

            expect(result).toEqual(activeUsers);
        });
    });

    describe('getSuspendedUsers', () => {
        it('should return all suspended users', async () => {
            const suspendedUsers = [
                { id: 'user1', username: 'user1', email: 'user1@example.com', is_suspended: true },
                { id: 'user2', username: 'user2', email: 'user2@example.com', is_suspended: true }
            ];

            (prisma.user.findMany as jest.Mock).mockResolvedValue(suspendedUsers);

            const result = await userService.getSuspendedUsers();

            expect(result).toEqual(suspendedUsers);
        });
    });

    describe('getDeletedUsers', () => {
        it('should return all deleted users', async () => {
            const deletedUsers = [
                { id: 'user1', username: 'user1', email: 'user1@example.com', is_deleted: true },
                { id: 'user2', username: 'user2', email: 'user2@example.com', is_deleted: true }
            ];

            (prisma.user.findMany as jest.Mock).mockResolvedValue(deletedUsers);

            const result = await userService.getDeletedUsers();

            expect(result).toEqual(deletedUsers);
        });
    });

    describe('changePassword', () => {
        it('should change a user\'s password and send a confirmation email', async () => {
            const user = {
                id: 'user1',
                email: 'user1@example.com',
                password: 'oldPassword',
                salt: 'salt'
            };

            const current_password = 'newPassword123';
            const new_password = 'newPassword123';
            const hash = 'hashedNewPassword';

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (userService.hashPassword as jest.Mock).mockResolvedValue({ hash, salt: 'salt' });
            (prisma.user.update as jest.Mock).mockResolvedValue({ ...user, password: hash });
            (sendEmail as jest.Mock).mockResolvedValue({});

            await userService.changePassword('user1', {current_password, new_password});

            expect(userService.hashPassword).toHaveBeenCalledWith({current_password, new_password});
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 'user1' },
                data: { password: hash }
            });
            expect(sendEmail).toHaveBeenCalledWith({
                to: 'user1@example.com',
                subject: 'Password Change Confirmation',
                template: 'PasswordChangeConfirmation',
                context: { username: 'user1' }
            });
        });

        it('should throw a 404 error if user not found', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            const obj = {current_password: 'current_password', new_password: 'new_password'}

            await expect(userService.changePassword('nonexistent', obj)).rejects.toThrow(createError(404, 'User not found'));
        });
    });
});
