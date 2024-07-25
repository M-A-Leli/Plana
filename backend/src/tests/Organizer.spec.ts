import bcrypt from 'bcrypt';
import OrganizerService from '../services/Organizer.service';
import prisma from '../config/Prisma.config';
import sendEmail from '../utils/Email.util';

jest.mock('../config/Prisma.config');
jest.mock('bcrypt');
jest.mock('../utils/Email.util');

describe('OrganizerService', () => {
    let organizerService: OrganizerService;

    beforeEach(() => {
        organizerService = new OrganizerService();
        jest.clearAllMocks();
    });

    describe('hashPassword', () => {
        it('should hash the password correctly', async () => {
            const password = 'password123';
            const salt = 'somesalt';
            const hash = 'hashedpassword';

            (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
            (bcrypt.hash as jest.Mock).mockResolvedValue(hash);

            const result = await organizerService.hashPassword(password);

            expect(result).toEqual({ hash, salt });
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
        });
    });

    describe('getAllOrganizers', () => {
        it('should return all organizers', async () => {
            const organizers = [{ id: '1', company: 'Test', bio: 'Bio', is_deleted: false, approved: true, user: { id: '1', username: 'user1', email: 'user1@example.com', profile_img: 'img.png', is_suspended: false } }];
            (prisma.organizer.findMany as jest.Mock).mockResolvedValue(organizers);

            const result = await organizerService.getAllOrganizers();

            expect(result).toEqual(organizers);
        });

        it('should throw a 404 error if no organizers are found', async () => {
            (prisma.organizer.findMany as jest.Mock).mockResolvedValue([]);

            await expect(organizerService.getAllOrganizers()).rejects.toThrow('No organizers found');
        });
    });

    describe('getOrganizerById', () => {
        it('should return an organizer by ID', async () => {
            const organizer = { id: '1', company: 'Test', bio: 'Bio', approved: true, user: { id: '1', username: 'user1', email: 'user1@example.com', profile_img: 'img.png' } };
            (prisma.organizer.findFirst as jest.Mock).mockResolvedValue(organizer);

            const result = await organizerService.getOrganizerById('1');

            expect(result).toEqual(organizer);
        });

        it('should throw a 404 error if the organizer is not found', async () => {
            (prisma.organizer.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(organizerService.getOrganizerById('1')).rejects.toThrow('Organizer not found');
        });
    });

    describe('createOrganizer', () => {
        it('should create a new organizer', async () => {
            const user = { id: '1', email: 'user1@example.com', username: 'user1', is_deleted: false, is_suspended: false };
            const organizerData = { company: 'Test', bio: 'Bio' };
            const newOrganizer = { id: '1', company: 'Test', bio: 'Bio', approved: true, user: { id: '1', username: 'user1', email: 'user1@example.com', profile_img: 'img.png' } };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.organizer.findFirst as jest.Mock).mockResolvedValue(null);
            (prisma.organizer.create as jest.Mock).mockResolvedValue(newOrganizer);
            (sendEmail as jest.Mock).mockResolvedValue(null);

            const result = await organizerService.createOrganizer(user.id, organizerData);

            expect(result).toEqual(newOrganizer);
        });

        it('should throw a 404 error if the user is not found or is deleted/suspended', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(organizerService.createOrganizer('1', { company: 'Test' })).rejects.toThrow('User not found');
        });

        it('should throw a 409 error if the company name is already taken', async () => {
            const user = { id: '1', email: 'user1@example.com', username: 'user1', is_deleted: false, is_suspended: false };
            const existingOrganizer = { id: '1', company: 'Test' };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.organizer.findFirst as jest.Mock).mockResolvedValue(existingOrganizer);

            await expect(organizerService.createOrganizer(user.id, { company: 'Test' })).rejects.toThrow('Company name is already taken.');
        });

        it('should throw an error if email sending fails', async () => {
            const user = { id: '1', email: 'user1@example.com', username: 'user1', is_deleted: false, is_suspended: false };
            const newOrganizer = { id: '1', company: 'Test', bio: 'Bio', approved: true, user: { id: '1', username: 'user1', email: 'user1@example.com', profile_img: 'img.png' } };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.organizer.findFirst as jest.Mock).mockResolvedValue(null);
            (prisma.organizer.create as jest.Mock).mockResolvedValue(newOrganizer);
            (sendEmail as jest.Mock).mockRejectedValue(new Error('Email error'));

            await expect(organizerService.createOrganizer(user.id, { company: 'Test' })).rejects.toThrow('Failed to send email: Email error');
        });
    });

    describe('approveOrganizer', () => {
        it('should approve an organizer', async () => {
            const organizer = { id: '1', user_id: '1', approved: false, is_deleted: false };
            const user = { id: '1', email: 'user1@example.com', username: 'user1', is_deleted: false, is_suspended: false };

            (prisma.organizer.findUnique as jest.Mock).mockResolvedValue(organizer);
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.$transaction as jest.Mock).mockResolvedValue(null);
            (sendEmail as jest.Mock).mockResolvedValue(null);

            await organizerService.approveOrganizer('1');

            expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function));
        });

        it('should throw a 404 error if the organizer is not found', async () => {
            (prisma.organizer.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(organizerService.approveOrganizer('1')).rejects.toThrow('Organizer not found');
        });

        it('should throw a 400 error if the organizer is already approved', async () => {
            const organizer = { id: '1', user_id: '1', approved: true };

            (prisma.organizer.findUnique as jest.Mock).mockResolvedValue(organizer);

            await expect(organizerService.approveOrganizer('1')).rejects.toThrow('Organizer already approved');
        });

        it('should throw an error if email sending fails', async () => {
            const organizer = { id: '1', user_id: '1', approved: false, is_deleted: false };
            const user = { id: '1', email: 'user1@example.com', username: 'user1', is_deleted: false, is_suspended: false };

            (prisma.organizer.findUnique as jest.Mock).mockResolvedValue(organizer);
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.$transaction as jest.Mock).mockResolvedValue(null);
            (sendEmail as jest.Mock).mockRejectedValue(new Error('Email error'));

            await expect(organizerService.approveOrganizer('1')).rejects.toThrow('Failed to send email: Email error');
        });
    });

    describe('revokeOrganizer', () => {
        it('should revoke an organizer', async () => {
            const organizer = { id: '1', user_id: '1', approved: true, is_deleted: false };
            const user = { id: '1', email: 'user1@example.com', username: 'user1', is_deleted: false, is_suspended: false };

            (prisma.organizer.findUnique as jest.Mock).mockResolvedValue(organizer);
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.$transaction as jest.Mock).mockResolvedValue(null);
            (sendEmail as jest.Mock).mockResolvedValue(null);

            await organizerService.revokeOrganizer('1');

            expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function));
        });

        it('should throw a 404 error if the organizer is not found', async () => {
            (prisma.organizer.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(organizerService.revokeOrganizer('1')).rejects.toThrow('Organizer not found');
        });

        it('should throw a 400 error if the organizer is already revoked', async () => {
            const organizer = { id: '1', user_id: '1', approved: false, is_deleted: false };

            (prisma.organizer.findUnique as jest.Mock).mockResolvedValue(organizer);

            await expect(organizerService.revokeOrganizer('1')).rejects.toThrow('Organizer already revoked');
        });

        it('should throw an error if email sending fails', async () => {
            const organizer = { id: '1', user_id: '1', approved: true, is_deleted: false };
            const user = { id: '1', email: 'user1@example.com', username: 'user1', is_deleted: false, is_suspended: false };

            (prisma.organizer.findUnique as jest.Mock).mockResolvedValue(organizer);
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.$transaction as jest.Mock).mockResolvedValue(null);
            (sendEmail as jest.Mock).mockRejectedValue(new Error('Email error'));

            await expect(organizerService.revokeOrganizer('1')).rejects.toThrow('Failed to send email: Email error');
        });
    });

    describe('updateOrganizer', () => {
        it('should update an organizer', async () => {
            const organizer = { id: '1', user_id: '1', company: 'Old Company', bio: 'Old Bio', approved: true };
            const user = { id: '1', email: 'user1@example.com', username: 'user1', is_deleted: false, is_suspended: false };
            const updatedOrganizer = { id: '1', company: 'New Company', bio: 'New Bio', approved: true, user: { id: '1', username: 'user1', email: 'user1@example.com', profile_img: 'img.png' } };

            (prisma.organizer.findFirst as jest.Mock).mockResolvedValue(organizer);
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.user.update as jest.Mock).mockResolvedValue(user);
            (prisma.organizer.update as jest.Mock).mockResolvedValue(updatedOrganizer);

            const result = await organizerService.updateOrganizer('1', { email: 'user1@example.com', username: 'user1', company: 'New Company', bio: 'New Bio' });

            expect(result).toEqual(updatedOrganizer);
        });

        it('should throw a 404 error if the organizer or user is not found', async () => {
            (prisma.organizer.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(organizerService.updateOrganizer('1', { email: 'user1@example.com', username: 'user1', company: 'New Company', bio: 'New Bio' })).rejects.toThrow('Organizer not found');
        });

        it('should throw a 409 error if the email or username already exists', async () => {
            const organizer = { id: '1', user_id: '1', company: 'Old Company', bio: 'Old Bio', approved: true };
            const user = { id: '1', email: 'user1@example.com', username: 'user1', is_deleted: false, is_suspended: false };
            const existingUserWithEmail = { id: '2', email: 'user2@example.com' };

            (prisma.organizer.findFirst as jest.Mock).mockResolvedValue(organizer);
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.user.findFirst as jest.Mock).mockResolvedValue(existingUserWithEmail);

            await expect(organizerService.updateOrganizer('1', { email: 'user2@example.com', username: 'user1', company: 'New Company', bio: 'New Bio' })).rejects.toThrow('Email already exists');
        });

        it('should throw a 409 error if the company name already exists', async () => {
            const organizer = { id: '1', user_id: '1', company: 'Old Company', bio: 'Old Bio', approved: true };
            const user = { id: '1', email: 'user1@example.com', username: 'user1', is_deleted: false, is_suspended: false };
            const existingOrganizer = { id: '2', company: 'New Company' };

            (prisma.organizer.findFirst as jest.Mock).mockResolvedValue(organizer);
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.organizer.findFirst as jest.Mock).mockResolvedValue(existingOrganizer);

            await expect(organizerService.updateOrganizer('1', { email: 'user1@example.com', username: 'user1', company: 'New Company', bio: 'New Bio' })).rejects.toThrow('Company name is already taken.');
        });
    });

    describe('deleteOrganizer', () => {
        it('should delete an organizer', async () => {
            const organizer = { id: '1', user_id: '1', is_deleted: false };
            const user = { id: '1', is_deleted: false };

            (prisma.organizer.findFirst as jest.Mock).mockResolvedValue(organizer);
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.$transaction as jest.Mock).mockResolvedValue(null);

            await organizerService.deleteOrganizer('1');

            expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function));
        });

        it('should throw a 404 error if the organizer or user is not found', async () => {
            (prisma.organizer.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(organizerService.deleteOrganizer('1')).rejects.toThrow('Organizer not found');
        });

        it('should throw an error if the transaction fails', async () => {
            (prisma.organizer.findFirst as jest.Mock).mockResolvedValue({ id: '1', user_id: '1', is_deleted: false });
            (prisma.$transaction as jest.Mock).mockRejectedValue(new Error('Transaction error'));

            await expect(organizerService.deleteOrganizer('1')).rejects.toThrow('Error deleting organizer: Transaction error');
        });
    });

    describe('getActiveOrganizers', () => {
        it('should return active organizers', async () => {
            const organizers = [{ id: '1', company: 'Test', bio: 'Bio', is_deleted: false, approved: true, user: { id: '1', username: 'user1', email: 'user1@example.com', profile_img: 'img.png', is_suspended: false } }];
            (prisma.organizer.findMany as jest.Mock).mockResolvedValue(organizers);

            const result = await organizerService.getActiveOrganizers();

            expect(result).toEqual(organizers);
        });

        it('should throw a 404 error if no active organizers are found', async () => {
            (prisma.organizer.findMany as jest.Mock).mockResolvedValue([]);

            await expect(organizerService.getActiveOrganizers()).rejects.toThrow('No organizers found');
        });
    });

    describe('getApprovedOrganizers', () => {
        it('should return approved organizers', async () => {
            const organizers = [{ id: '1', company: 'Test', bio: 'Bio', is_deleted: false, approved: true, user: { id: '1', username: 'user1', email: 'user1@example.com', profile_img: 'img.png', is_suspended: false } }];
            (prisma.organizer.findMany as jest.Mock).mockResolvedValue(organizers);

            const result = await organizerService.getApprovedOrganizers();

            expect(result).toEqual(organizers);
        });

        it('should throw a 404 error if no approved organizers are found', async () => {
            (prisma.organizer.findMany as jest.Mock).mockResolvedValue([]);

            await expect(organizerService.getApprovedOrganizers()).rejects.toThrow('No organizers found');
        });
    });

    describe('getDeletedOrganizers', () => {
        it('should return deleted organizers', async () => {
            const organizers = [{ id: '1', company: 'Test', bio: 'Bio', is_deleted: true, approved: false, user: { id: '1', username: 'user1', email: 'user1@example.com', profile_img: 'img.png', is_suspended: false } }];
            (prisma.organizer.findMany as jest.Mock).mockResolvedValue(organizers);

            const result = await organizerService.getDeletedOrganizers();

            expect(result).toEqual(organizers);
        });

        it('should throw a 404 error if no deleted organizers are found', async () => {
            (prisma.organizer.findMany as jest.Mock).mockResolvedValue([]);

            await expect(organizerService.getDeletedOrganizers()).rejects.toThrow('No organizers found');
        });
    });

    describe('getOrganizerAnalytics', () => {
        it('should return organizer analytics', async () => {
            const allOrganizers = 10;
            const activeOrganizers = 8;
            const approvedOrganizers = 6;
            const deletedOrganizers = 2;

            (prisma.organizer.count as jest.Mock).mockImplementation(({ where }) => {
                if (where) {
                    if (where.is_deleted === false && where.approved === undefined) return activeOrganizers;
                    if (where.approved === true) return approvedOrganizers;
                    if (where.is_deleted === true) return deletedOrganizers;
                }
                return allOrganizers;
            });

            const result = await organizerService.getOrganizerAnalytics();

            expect(result).toEqual({ all: allOrganizers, active: activeOrganizers, approved: approvedOrganizers, deleted: deletedOrganizers });
        });

        it('should throw an error if fetching analytics fails', async () => {
            (prisma.organizer.count as jest.Mock).mockRejectedValue(new Error('Count error'));

            await expect(organizerService.getOrganizerAnalytics()).rejects.toThrow('Failed to get organizer analytics: Count error');
        });
    });
});
