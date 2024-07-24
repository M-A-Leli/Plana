import bcrypt from 'bcrypt';
import createError from 'http-errors';
import prisma from '../config/Prisma.config';
import sendEmail from '../utils/Email.util';
import AttendeeService from '../services/Attendee.service';

jest.mock('bcrypt');
jest.mock('../config/Prisma.config');
jest.mock('../utils/Email.util');

describe('AttendeeService', () => {
  let attendeeService: AttendeeService;

  beforeEach(() => {
    attendeeService = new AttendeeService();
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash the password with salt', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hash');

      const result = await attendeeService.hashPassword('password');
      expect(result).toEqual({ hash: 'hash', salt: 'salt' });
    });
  });

  describe('getAllAttendees', () => {
    it('should return all attendees', async () => {
      const attendees = [{ id: '1', bio: 'bio', is_deleted: false, user: { id: '1', username: 'user', email: 'user@test.com', profile_img: 'img.png', is_suspended: false } }];
      (prisma.attendee.findMany as jest.Mock).mockResolvedValue(attendees);

      const result = await attendeeService.getAllAttendees();
      expect(result).toEqual(attendees);
    });

    it('should throw an error if no attendees are found', async () => {
      (prisma.attendee.findMany as jest.Mock).mockResolvedValue([]);

      await expect(attendeeService.getAllAttendees()).rejects.toThrow(createError(404, 'No attendees found'));
    });
  });

  describe('getAttendeeById', () => {
    it('should return the attendee by ID', async () => {
      const attendee = { id: '1', bio: 'bio', user: { id: '1', username: 'user', email: 'user@test.com', profile_img: 'img.png' } };
      (prisma.attendee.findFirst as jest.Mock).mockResolvedValue(attendee);

      const result = await attendeeService.getAttendeeById('1');
      expect(result).toEqual(attendee);
    });

    it('should throw an error if attendee is not found', async () => {
      (prisma.attendee.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(attendeeService.getAttendeeById('1')).rejects.toThrow(createError(404, 'Attendee not found'));
    });
  });

  describe('createAttendee', () => {
    it('should create a new attendee', async () => {
      const data = { email: 'new@test.com', username: 'newuser', password: 'password', bio: 'bio' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hash');
      (prisma.user.create as jest.Mock).mockResolvedValue({ id: '1', email: 'new@test.com', username: 'newuser' });
      (prisma.attendee.create as jest.Mock).mockResolvedValue({ id: '1', bio: 'bio', user: { id: '1', username: 'newuser', email: 'new@test.com', profile_img: 'img.png' } });

      const result = await attendeeService.createAttendee(data);
      expect(result).toEqual({ id: '1', bio: 'bio', user: { id: '1', username: 'newuser', email: 'new@test.com', profile_img: 'img.png' } });
      expect(sendEmail).toHaveBeenCalled();
    });

    it('should throw an error if email already exists', async () => {
      const data = { email: 'existing@test.com', username: 'newuser', password: 'password', bio: 'bio' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: 'existingUserId' });

      await expect(attendeeService.createAttendee(data)).rejects.toThrow(createError(409, 'Email already exists'));
    });

    it('should throw an error if username already exists', async () => {
      const data = { email: 'new@test.com', username: 'existinguser', password: 'password', bio: 'bio' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'existingUserId' });

      await expect(attendeeService.createAttendee(data)).rejects.toThrow(createError(409, 'Username already exists'));
    });
  });

  describe('updateAttendee', () => {
    it('should update an attendee', async () => {
      const data = { email: 'updated@test.com', username: 'updateduser', bio: 'updated bio' };
      const attendee = { id: '1', bio: 'bio', user: { id: '1', username: 'user', email: 'user@test.com', profile_img: 'img.png', is_suspended: false, is_deleted: false } };
      (prisma.attendee.findFirst as jest.Mock).mockResolvedValue(attendee);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(attendee.user);
      (prisma.user.update as jest.Mock).mockResolvedValue({ id: '1', email: 'updated@test.com', username: 'updateduser' });
      (prisma.attendee.update as jest.Mock).mockResolvedValue({ ...attendee, bio: 'updated bio', user: { ...attendee.user, email: 'updated@test.com', username: 'updateduser' } });

      const result = await attendeeService.updateAttendee('1', data);
      expect(result).toEqual({ ...attendee, bio: 'updated bio', user: { ...attendee.user, email: 'updated@test.com', username: 'updateduser' } });
    });

    it('should throw an error if attendee is not found', async () => {
      (prisma.attendee.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(attendeeService.updateAttendee('1', { email: 'updated@test.com', username: 'updateduser', bio: 'updated bio' })).rejects.toThrow(createError(404, 'Attendee not found'));
    });

    it('should throw an error if email already exists', async () => {
      const data = { email: 'existing@test.com', username: 'updateduser', bio: 'updated bio' };
      const attendee = { id: '1', bio: 'bio', user: { id: '1', username: 'user', email: 'user@test.com', profile_img: 'img.png', is_suspended: false, is_deleted: false } };
      (prisma.attendee.findFirst as jest.Mock).mockResolvedValue(attendee);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(attendee.user);
      (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 'existingUserId' });

      await expect(attendeeService.updateAttendee('1', data)).rejects.toThrow(createError(409, 'Email already exists'));
    });

    it('should throw an error if username already exists', async () => {
      const data = { email: 'updated@test.com', username: 'existinguser', bio: 'updated bio' };
      const attendee = { id: '1', bio: 'bio', user: { id: '1', username: 'user', email: 'user@test.com', profile_img: 'img.png', is_suspended: false, is_deleted: false } };
      (prisma.attendee.findFirst as jest.Mock).mockResolvedValue(attendee);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(attendee.user);
      (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'existingUserId' });

      await expect(attendeeService.updateAttendee('1', data)).rejects.toThrow(createError(409, 'Username already exists'));
    });
  });

  describe('deleteAttendee', () => {
    it('should delete an attendee', async () => {
      const attendee = { id: '1', user_id: '1', bio: 'bio', user: { id: '1', username: 'user', email: 'user@test.com', profile_img: 'img.png', is_suspended: false, is_deleted: false } };
      (prisma.attendee.findFirst as jest.Mock).mockResolvedValue(attendee);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(attendee.user);
      (prisma.$transaction as jest.Mock).mockResolvedValue(true);

      await attendeeService.deleteAttendee('1');
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should throw an error if attendee is not found', async () => {
      (prisma.attendee.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(attendeeService.deleteAttendee('1')).rejects.toThrow(createError(404, 'Attendee not found'));
    });

    it('should throw an error if user is not found', async () => {
      const attendee = { id: '1', user_id: '1', bio: 'bio', user: { id: '1', username: 'user', email: 'user@test.com', profile_img: 'img.png', is_suspended: false, is_deleted: false } };
      (prisma.attendee.findFirst as jest.Mock).mockResolvedValue(attendee);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(attendeeService.deleteAttendee('1')).rejects.toThrow(createError(404, 'User not found'));
    });
  });

  describe('getAttendeeProfile', () => {
    it('should return the attendee profile by user ID', async () => {
      const attendee = { id: '1', bio: 'bio', user: { id: '1', username: 'user', email: 'user@test.com', profile_img: 'img.png' } };
      (prisma.attendee.findFirst as jest.Mock).mockResolvedValue(attendee);

      const result = await attendeeService.getAttendeeProfile('1');
      expect(result).toEqual(attendee);
    });

    it('should throw an error if attendee profile is not found', async () => {
      (prisma.attendee.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(attendeeService.getAttendeeProfile('1')).rejects.toThrow(createError(404, 'Attendee not found'));
    });
  });

  describe('updateAttendeeProfile', () => {
    it('should update an attendee profile', async () => {
      const data = { email: 'updated@test.com', username: 'updateduser', bio: 'updated bio' };
      const attendee = { id: '1', bio: 'bio', user: { id: '1', username: 'user', email: 'user@test.com', profile_img: 'img.png', is_suspended: false, is_deleted: false } };
      (prisma.attendee.findFirst as jest.Mock).mockResolvedValue(attendee);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(attendee.user);
      (prisma.user.update as jest.Mock).mockResolvedValue({ id: '1', email: 'updated@test.com', username: 'updateduser' });
      (prisma.attendee.update as jest.Mock).mockResolvedValue({ ...attendee, bio: 'updated bio', user: { ...attendee.user, email: 'updated@test.com', username: 'updateduser' } });

      const result = await attendeeService.updateAttendeeProfile('1', data);
      expect(result).toEqual({ ...attendee, bio: 'updated bio', user: { ...attendee.user, email: 'updated@test.com', username: 'updateduser' } });
    });

    it('should throw an error if attendee profile is not found', async () => {
      (prisma.attendee.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(attendeeService.updateAttendeeProfile('1', { email: 'updated@test.com', username: 'updateduser', bio: 'updated bio' })).rejects.toThrow(createError(404, 'Attendee not found'));
    });

    it('should throw an error if email already exists', async () => {
      const data = { email: 'existing@test.com', username: 'updateduser', bio: 'updated bio' };
      const attendee = { id: '1', bio: 'bio', user: { id: '1', username: 'user', email: 'user@test.com', profile_img: 'img.png', is_suspended: false, is_deleted: false } };
      (prisma.attendee.findFirst as jest.Mock).mockResolvedValue(attendee);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(attendee.user);
      (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 'existingUserId' });

      await expect(attendeeService.updateAttendeeProfile('1', data)).rejects.toThrow(createError(409, 'Email already exists'));
    });

    it('should throw an error if username already exists', async () => {
      const data = { email: 'updated@test.com', username: 'existinguser', bio: 'updated bio' };
      const attendee = { id: '1', bio: 'bio', user: { id: '1', username: 'user', email: 'user@test.com', profile_img: 'img.png', is_suspended: false, is_deleted: false } };
      (prisma.attendee.findFirst as jest.Mock).mockResolvedValue(attendee);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(attendee.user);
      (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'existingUserId' });

      await expect(attendeeService.updateAttendeeProfile('1', data)).rejects.toThrow(createError(409, 'Username already exists'));
    });
  });

  describe('getActiveAttendees', () => {
    it('should return all active attendees', async () => {
      const attendees = [{ id: '1', bio: 'bio', is_deleted: false, user: { id: '1', username: 'user', email: 'user@test.com', profile_img: 'img.png', is_suspended: false } }];
      (prisma.attendee.findMany as jest.Mock).mockResolvedValue(attendees);

      const result = await attendeeService.getActiveAttendees();
      expect(result).toEqual(attendees);
    });

    it('should throw an error if no active attendees are found', async () => {
      (prisma.attendee.findMany as jest.Mock).mockResolvedValue([]);

      await expect(attendeeService.getActiveAttendees()).rejects.toThrow(createError(404, 'No attendees found'));
    });
  });

  describe('getSuspendedAttendees', () => {
    it('should return all suspended attendees', async () => {
      const attendees = [{ id: '1', bio: 'bio', is_deleted: false, user: { id: '1', username: 'user', email: 'user@test.com', profile_img: 'img.png', is_suspended: true } }];
      (prisma.attendee.findMany as jest.Mock).mockResolvedValue(attendees);

      const result = await attendeeService.getSuspendedAttendees();
      expect(result).toEqual(attendees);
    });

    it('should throw an error if no suspended attendees are found', async () => {
      (prisma.attendee.findMany as jest.Mock).mockResolvedValue([]);

      await expect(attendeeService.getSuspendedAttendees()).rejects.toThrow(createError(404, 'No attendees found'));
    });
  });

  describe('getDeletedAttendees', () => {
    it('should return all deleted attendees', async () => {
      const attendees = [{ id: '1', bio: 'bio', is_deleted: true, user: { id: '1', username: 'user', email: 'user@test.com', profile_img: 'img.png', is_suspended: true } }];
      (prisma.attendee.findMany as jest.Mock).mockResolvedValue(attendees);

      const result = await attendeeService.getDeletedAttendees();
      expect(result).toEqual(attendees);
    });

    it('should throw an error if no deleted attendees are found', async () => {
      (prisma.attendee.findMany as jest.Mock).mockResolvedValue([]);

      await expect(attendeeService.getDeletedAttendees()).rejects.toThrow(createError(404, 'No attendees found'));
    });
  });

  describe('getAttendeeAnalytics', () => {
    it('should return attendee analytics', async () => {
      (prisma.attendee.count as jest.Mock).mockResolvedValueOnce(100).mockResolvedValueOnce(80).mockResolvedValueOnce(10).mockResolvedValueOnce(10);

      const result = await attendeeService.getAttendeeAnalytics();
      expect(result).toEqual({
        all_attendees: 100,
        active_attendees: 80,
        suspended_attendees: 10,
        deleted_attendees: 10,
      });
    });
  });
});
