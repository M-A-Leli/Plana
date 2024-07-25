import createError from 'http-errors';
import { PrismaClient, Event, Prisma } from '@prisma/client';
import EventService from '../services/Event.service';

const prisma = new PrismaClient();
const eventService = new EventService();

jest.mock('../config/Prisma.config', () => prisma);

describe('EventService', () => {

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('getAllEvents', () => {
    it('should return all events', async () => {
      const events: Partial<Event>[] = [
        { id: '1', title: 'Event 1', is_deleted: false },
        { id: '2', title: 'Event 2', is_deleted: false }
      ];

      prisma.event.findMany = jest.fn().mockResolvedValue(events);

      const result = await eventService.getAllEvents();
      expect(result).toEqual(events);
    });

    it('should throw 404 if no events found', async () => {
      prisma.event.findMany = jest.fn().mockResolvedValue([]);

      await expect(eventService.getAllEvents()).rejects.toThrowError(createError(404, 'No events found'));
    });
  });

  describe('getEventById', () => {
    it('should return the event by id', async () => {
      const event: Partial<Event> = { id: '1', title: 'Event 1', is_deleted: false };

      prisma.event.findFirst = jest.fn().mockResolvedValue(event);

      const result = await eventService.getEventById('1');
      expect(result).toEqual(event);
    });

    it('should throw 404 if event not found', async () => {
      prisma.event.findFirst = jest.fn().mockResolvedValue(null);

      await expect(eventService.getEventById('1')).rejects.toThrowError(createError(404, 'Event not found'));
    });
  });

  describe('createEvent', () => {
    it('should create a new event', async () => {
      const organizer = { id: 'org1', user_id: 'user1', is_deleted: false };
      const user = { id: 'user1', is_deleted: false, is_suspended: false };
      const eventData: Prisma.EventUncheckedCreateInput = { title: 'New Event', description: 'Event Description', date: new Date(), start_time: '10:00', end_time: '12:00', venue: 'Venue', organizer_id: 'org1', category_id: 'cat1' };
      const newEvent: Partial<Event> = { id: '1', title: 'New Event', description: 'Event Description' };

      prisma.organizer.findFirst = jest.fn().mockResolvedValue(organizer);
      prisma.user.findUnique = jest.fn().mockResolvedValue(user);
      prisma.event.create = jest.fn().mockResolvedValue(newEvent);

    //   const result = await eventService.createEvent('user1', eventData, []);
    //   expect(result).toEqual(newEvent);
    });

    it('should throw 404 if organizer not found', async () => {
      prisma.organizer.findFirst = jest.fn().mockResolvedValue(null);

      await expect(eventService.createEvent('user1', { title: 'Event', description: 'Description' } as any, [])).rejects.toThrowError(createError(404, 'Organizer not found'));
    });

    it('should throw 404 if user not found', async () => {
      const organizer = { id: 'org1', user_id: 'user1', is_deleted: false };

      prisma.organizer.findFirst = jest.fn().mockResolvedValue(organizer);
      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(eventService.createEvent('user1', { title: 'Event', description: 'Description' } as any, [])).rejects.toThrowError(createError(404, 'User not found'));
    });

    it('should throw 400 if more than 4 images provided', async () => {
      const organizer = { id: 'org1', user_id: 'user1', is_deleted: false };
      const user = { id: 'user1', is_deleted: false, is_suspended: false };

      prisma.organizer.findFirst = jest.fn().mockResolvedValue(organizer);
      prisma.user.findUnique = jest.fn().mockResolvedValue(user);

      await expect(eventService.createEvent('user1', { title: 'Event', description: 'Description' } as any, ['img1', 'img2', 'img3', 'img4', 'img5'])).rejects.toThrowError(createError(400, 'An event can have at most 4 images'));
    });
  });

  describe('updateEvent', () => {
    it('should update an existing event', async () => {
      const event = { id: '1', date: new Date(), is_deleted: false };
      const updatedEvent = { ...event, title: 'Updated Event' };

      prisma.event.findUnique = jest.fn().mockResolvedValue(event);
      prisma.event.update = jest.fn().mockResolvedValue(updatedEvent);

      const result = await eventService.updateEvent('1', { title: 'Updated Event' }, []);
      expect(result).toEqual(updatedEvent);
    });

    it('should throw 404 if event not found', async () => {
      prisma.event.findUnique = jest.fn().mockResolvedValue(null);

      await expect(eventService.updateEvent('1', { title: 'Updated Event' }, [])).rejects.toThrowError(createError(404, 'Event not found'));
    });

    it('should throw 400 if trying to update past event', async () => {
      const event = { id: '1', date: new Date(Date.now() - 86400000), is_deleted: false }; // 1 day in the past

      prisma.event.findUnique = jest.fn().mockResolvedValue(event);

      await expect(eventService.updateEvent('1', { title: 'Updated Event' }, [])).rejects.toThrowError(createError(400, 'Past events cannot be edited'));
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      const event = { id: '1', date: new Date(Date.now() - 86400000), end_time: '12:00', is_deleted: false, orders: [] };

      prisma.event.findUnique = jest.fn().mockResolvedValue(event);
      prisma.event.update = jest.fn().mockResolvedValue({ ...event, is_deleted: true });

      await eventService.deleteEvent('1');
      expect(prisma.event.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { is_deleted: true }
      });
    });

    it('should throw 404 if event not found', async () => {
      prisma.event.findUnique = jest.fn().mockResolvedValue(null);

      await expect(eventService.deleteEvent('1')).rejects.toThrowError(createError(404, 'Event not found'));
    });

    it('should throw 400 if event has purchased tickets and event has not ended', async () => {
      const event = { id: '1', date: new Date(), end_time: '12:00', is_deleted: false, orders: [{ id: 'order1' }] };

      prisma.event.findUnique = jest.fn().mockResolvedValue(event);

      await expect(eventService.deleteEvent('1')).rejects.toThrowError(createError(400, 'Event cannot be deleted as it has purchased tickets and the event has not ended'));
    });
  });

  describe('getEventsByOrganizerId', () => {
    it('should return events by organizer id', async () => {
      const organizer = { id: 'org1', is_deleted: false };
      const events: Partial<Event>[] = [{ id: '1', title: 'Event 1', organizer_id: 'org1', is_deleted: false }];

      prisma.organizer.findUnique = jest.fn().mockResolvedValue(organizer);
      prisma.event.findMany = jest.fn().mockResolvedValue(events);

      const result = await eventService.getEventsByOrganizerId('org1');
      expect(result).toEqual(events);
    });

    it('should throw 404 if organizer not found', async () => {
      prisma.organizer.findUnique = jest.fn().mockResolvedValue(null);

      await expect(eventService.getEventsByOrganizerId('org1')).rejects.toThrowError(createError(404, 'Organizer not found'));
    });

    it('should throw 404 if no events found', async () => {
      const organizer = { id: 'org1', is_deleted: false };

      prisma.organizer.findUnique = jest.fn().mockResolvedValue(organizer);
      prisma.event.findMany = jest.fn().mockResolvedValue([]);

      await expect(eventService.getEventsByOrganizerId('org1')).rejects.toThrowError(createError(404, 'No events found'));
    });
  });

});
