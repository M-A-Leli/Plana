import bcrypt from 'bcrypt';
import createError from 'http-errors';
import prisma from '../config/Prisma.config';
import AuthService from '../services/Auth.service';

jest.mock('bcrypt');
jest.mock('../config/Prisma.config');

describe('AuthService', () => {

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('findUserByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: '1', password: 'hashed_password', admin: [], attendees: [], organizers: [] };
      prisma.user.findUnique = jest.fn().mockResolvedValue(user);

      const result = await AuthService.findUserByEmail('test@example.com');
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      const result = await AuthService.findUserByEmail('test@example.com');
      expect(result).toBeNull();
    });
  });

  describe('findUserByID', () => {
    it('should return a user by ID', async () => {
      const user = { id: '1', password: 'hashed_password', admin: [], attendees: [], organizers: [] };
      prisma.user.findUnique = jest.fn().mockResolvedValue(user);

      const result = await AuthService.findUserByID('1');
      expect(result).toEqual(user);
    });

    it('should throw 404 if user is not found', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(AuthService.findUserByID('1')).rejects.toThrowError(createError(404, 'User not found'));
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await AuthService.validatePassword('password', 'hashed_password');
      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await AuthService.validatePassword('password', 'hashed_password');
      expect(result).toBe(false);
    });
  });

  describe('login', () => {
    it('should return user for valid credentials', async () => {
      const user = { id: '1', password: 'hashed_password', admin: [], attendees: [], organizers: [] };
      prisma.user.findUnique = jest.fn().mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await AuthService.login('test@example.com', 'password');
      expect(result).toEqual(user);
    });

    it('should throw 401 for invalid email', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(AuthService.login('test@example.com', 'password')).rejects.toThrowError(createError(401, 'Invalid email or password'));
    });

    it('should throw 401 for invalid password', async () => {
      const user = { id: '1', password: 'hashed_password', admin: [], attendees: [], organizers: [] };
      prisma.user.findUnique = jest.fn().mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(AuthService.login('test@example.com', 'password')).rejects.toThrowError(createError(401, 'Invalid email or password'));
    });
  });

});
