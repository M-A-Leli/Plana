import createError from 'http-errors';
import bcrypt from 'bcrypt';
import prisma from '../config/Prisma.config';
import sendEmail from '../utils/Email.util';
import AdminService from '../services/Admin.service';

jest.mock('../config/Prisma.config');
jest.mock('../utils/Email.util');
jest.mock('bcrypt');

describe('AdminService', () => {
  const adminService = new AdminService();
  const BASE_URL = `http://localhost:${process.env.PORT}`;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePassword', () => {
    it('should generate a password of the specified length', () => {
      const password = AdminService.generatePassword(12);
      expect(password).toHaveLength(12);
    });

    it('should include at least one uppercase letter, one lowercase letter, one number, and one special character', () => {
      const password = AdminService.generatePassword();
      expect(password).toMatch(/[A-Z]/);
      expect(password).toMatch(/[a-z]/);
      expect(password).toMatch(/[0-9]/);
      expect(password).toMatch(/[!@#$%^&*()\-_=+\[\]{}|;:,.<>?]/);
    });
  });

  describe('hashPassword', () => {
    it('should return a hash and salt for a given password', async () => {
      const password = 'testPassword';
      const hash = 'hashedPassword';
      const salt = 'salt';
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hash);

      const result = await adminService.hashPassword(password);
      expect(result).toEqual({ hash, salt });
    });
  });

  describe('getAllAdmins', () => {
    it('should return a list of admins', async () => {
      const admins = [{ id: '1', level: 1, user: { id: '1', username: 'admin', email: 'admin@test.com', profile_img: 'img.png' } }];
      (prisma.admin.findMany as jest.Mock).mockResolvedValue(admins);

      const result = await adminService.getAllAdmins();
      expect(result).toEqual(admins);
    });

    it('should throw an error if no admins are found', async () => {
      (prisma.admin.findMany as jest.Mock).mockResolvedValue([]);

      await expect(adminService.getAllAdmins()).rejects.toThrow(createError(404, 'No admins found'));
    });
  });

  describe('getAdminById', () => {
    it('should return an admin by ID', async () => {
      const admin = { id: '1', level: 1, user: { id: '1', username: 'admin', email: 'admin@test.com', profile_img: 'img.png', is_suspended: false }, is_deleted: false };
      (prisma.admin.findFirst as jest.Mock).mockResolvedValue(admin);

      const result = await adminService.getAdminById('1');
      expect(result).toEqual(admin);
    });

    it('should throw an error if admin is not found', async () => {
      (prisma.admin.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(adminService.getAdminById('1')).rejects.toThrow(createError(404, 'Admin not found'));
    });
  });

  describe('createAdmin', () => {
    it('should create a new admin', async () => {
      const currentAdmin = { id: '1', level: 1, user_id: '1', is_deleted: false };
      const generatedPassword = 'generatedPassword';
      const hashedPassword = { hash: 'hashedPassword', salt: 'salt' };
      const newUser = { id: '2' };
      const newAdmin = { id: '2', level: 2, user: { id: '2', username: 'newadmin', email: 'newadmin@test.com', profile_img: `${BASE_URL}/images/default_profile_image.svg` } };

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      (prisma.admin.findUnique as jest.Mock).mockResolvedValue(currentAdmin);
      jest.spyOn(AdminService, 'generatePassword').mockReturnValue(generatedPassword);
      jest.spyOn(adminService, 'hashPassword').mockResolvedValue(hashedPassword);
      (prisma.user.create as jest.Mock).mockResolvedValue(newUser);
      (prisma.admin.create as jest.Mock).mockResolvedValue(newAdmin);

      const result = await adminService.createAdmin('1', { email: 'newadmin@test.com', username: 'newadmin' });

      expect(result).toEqual(newAdmin);
      expect(sendEmail).toHaveBeenCalledWith({
        to: 'newadmin@test.com',
        subject: 'Welcome to the Admin Team',
        template: 'WelcomeAdmin',
        context: {
          username: 'newadmin',
          email: 'newadmin@test.com',
          password: generatedPassword,
          loginUrl: 'http://localhost:4200/login'
        }
      });
    });

    it('should throw an error if email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: 'existingUserId' });

      await expect(adminService.createAdmin('1', { email: 'existing@test.com', username: 'newadmin' })).rejects.toThrow(createError(409, 'Email already exists'));
    });

    it('should throw an error if username already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'existingUserId' });

      await expect(adminService.createAdmin('1', { email: 'newadmin@test.com', username: 'existinguser' })).rejects.toThrow(createError(409, 'Username already exists'));
    });

    it('should throw an error if current admin is not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      (prisma.admin.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(adminService.createAdmin('1', { email: 'newadmin@test.com', username: 'newadmin' })).rejects.toThrow(createError(404, 'Current admin not found'));
    });
  });

  describe('updateAdmin', () => {
    it('should update an admin', async () => {
      const currentAdmin = { id: '1', level: 2, user_id: '1', is_deleted: false };
      const targetAdmin = { id: '2', level: 1, user_id: '2', is_deleted: false, user: { id: '2', email: 'old@test.com', username: 'oldadmin', profile_img: 'img.png', is_suspended: false } };
      const updatedUser = { id: '2', email: 'new@test.com', username: 'newadmin', profile_img: 'img.png' };
      const updatedAdmin = { id: '2', level: 1, user: updatedUser };

      (prisma.admin.findFirst as jest.Mock).mockResolvedValueOnce(currentAdmin).mockResolvedValueOnce(targetAdmin);
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await adminService.updateAdmin('1', '2', { email: 'new@test.com', username: 'newadmin' });
      expect(result).toEqual(updatedAdmin);
    });

    it('should throw an error if current admin is not found', async () => {
      (prisma.admin.findFirst as jest.Mock).mockResolvedValueOnce(null);

      await expect(adminService.updateAdmin('1', '2', { email: 'new@test.com', username: 'newadmin' })).rejects.toThrow(createError(404, 'Current admin not found'));
    });

    it('should throw an error if target admin is not found', async () => {
      const currentAdmin = { id: '1', level: 2, user_id: '1', is_deleted: false };
      (prisma.admin.findFirst as jest.Mock).mockResolvedValueOnce(currentAdmin).mockResolvedValueOnce(null);

      await expect(adminService.updateAdmin('1', '2', { email: 'new@test.com', username: 'newadmin' })).rejects.toThrow(createError(404, 'Target admin not found'));
    });

    it('should throw an error if permission is denied', async () => {
      const currentAdmin = { id: '1', level: 1, user_id: '1', is_deleted: false };
      const targetAdmin = { id: '2', level: 2, user_id: '2', is_deleted: false, user: { id: '2', email: 'old@test.com', username: 'oldadmin', profile_img: 'img.png', is_suspended: false } };

      (prisma.admin.findFirst as jest.Mock).mockResolvedValueOnce(currentAdmin).mockResolvedValueOnce(targetAdmin);

      await expect(adminService.updateAdmin('1', '2', { email: 'new@test.com', username: 'newadmin' })).rejects.toThrow(createError(403, 'Permission denied'));
    });

    it('should throw an error if email is already taken', async () => {
      const currentAdmin = { id: '1', level: 2, user_id: '1', is_deleted: false };
      const targetAdmin = { id: '2', level: 1, user_id: '2', is_deleted: false, user: { id: '2', email: 'old@test.com', username: 'oldadmin', profile_img: 'img.png', is_suspended: false } };

      (prisma.admin.findFirst as jest.Mock).mockResolvedValueOnce(currentAdmin).mockResolvedValueOnce(targetAdmin);
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: 'existingUserId' });

      await expect(adminService.updateAdmin('1', '2', { email: 'existing@test.com', username: 'newadmin' })).rejects.toThrow(createError(409, 'Email already exists'));
    });

    it('should throw an error if username is already taken', async () => {
      const currentAdmin = { id: '1', level: 2, user_id: '1', is_deleted: false };
      const targetAdmin = { id: '2', level: 1, user_id: '2', is_deleted: false, user: { id: '2', email: 'old@test.com', username: 'oldadmin', profile_img: 'img.png', is_suspended: false } };

      (prisma.admin.findFirst as jest.Mock).mockResolvedValueOnce(currentAdmin).mockResolvedValueOnce(targetAdmin);
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'existingUserId' });

      await expect(adminService.updateAdmin('1', '2', { email: 'new@test.com', username: 'existinguser' })).rejects.toThrow(createError(409, 'Username already exists'));
    });
  });

  describe('deleteAdmin', () => {
    it('should delete an admin', async () => {
      const currentAdmin = { id: '1', level: 2, user_id: '1', is_deleted: false };
      const targetAdmin = { id: '2', level: 1, user_id: '2', is_deleted: false, user: { id: '2', email: 'admin@test.com', username: 'admin', profile_img: 'img.png' } };

      (prisma.admin.findFirst as jest.Mock).mockResolvedValueOnce(currentAdmin).mockResolvedValueOnce(targetAdmin);
      (prisma.admin.update as jest.Mock).mockResolvedValue(targetAdmin);

      const result = await adminService.deleteAdmin('1', '2');
      expect(result).toEqual(targetAdmin);
    });

    it('should throw an error if current admin is not found', async () => {
      (prisma.admin.findFirst as jest.Mock).mockResolvedValueOnce(null);

      await expect(adminService.deleteAdmin('1', '2')).rejects.toThrow(createError(404, 'Current admin not found'));
    });

    it('should throw an error if target admin is not found', async () => {
      const currentAdmin = { id: '1', level: 2, user_id: '1', is_deleted: false };
      (prisma.admin.findFirst as jest.Mock).mockResolvedValueOnce(currentAdmin).mockResolvedValueOnce(null);

      await expect(adminService.deleteAdmin('1', '2')).rejects.toThrow(createError(404, 'Target admin not found'));
    });

    it('should throw an error if permission is denied', async () => {
      const currentAdmin = { id: '1', level: 1, user_id: '1', is_deleted: false };
      const targetAdmin = { id: '2', level: 2, user_id: '2', is_deleted: false, user: { id: '2', email: 'admin@test.com', username: 'admin', profile_img: 'img.png' } };

      (prisma.admin.findFirst as jest.Mock).mockResolvedValueOnce(currentAdmin).mockResolvedValueOnce(targetAdmin);

      await expect(adminService.deleteAdmin('1', '2')).rejects.toThrow(createError(403, 'Permission denied'));
    });
  });

});
