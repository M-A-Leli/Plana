import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import multer from 'multer';
import EventService from '../services/Event.service';
import { uploadMultiple } from '../utils/ImageUpload.util';

class EventController {

  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const events = await this.eventService.getAllEvents();
      res.status(200).json(events);
    } catch (error: any) {
      next(error);
    }
  }

  getEventById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await this.eventService.getEventById(req.params.id);
      res.status(200).json(event);
    } catch (error: any) {
      next(error);
    }
  }

  createEvent = async (req: Request, res: Response, next: NextFunction) => {
    uploadMultiple(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return next(createError(400, err.message));
      } else if (err) {
        return next(createError(400, err.message));
      }

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return next(createError(400, 'No files uploaded'));
      }

      try {
        const user_id = req.user?.id as string;
        const imagePaths = (req.files as Express.Multer.File[]).map(file => file.path);
        const newEvent = await this.eventService.createEvent(user_id, req.body, imagePaths);
        res.status(201).json(newEvent);
      } catch (error: any) {
        next(error);
      }
    });
  }

  updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    uploadMultiple(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return next(createError(400, err.message));
      } else if (err) {
        return next(createError(400, err.message));
      }

      try {
        const imagePaths = req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : [];
        const updatedEvent = await this.eventService.updateEvent(req.params.id, req.body, imagePaths);
        res.json(updatedEvent);
      } catch (error: any) {
        next(error);
      }
    });
  }


  deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.eventService.deleteEvent(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }

  getRelatedEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event_id = req.params.id;
      const events = await this.eventService.getRelatedEvents(event_id);
      res.status(200).json(events);
    } catch (error: any) {
      next(error);
    }
  }

  getEventsByOrganizerId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizerId = req.params.id;
      const events = await this.eventService.getEventsByOrganizerId(organizerId);
      res.status(200).json(events);
    } catch (error: any) {
      next(error);
    }
  }

  getUpcomingEventsByOrganizerId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizerId = req.params.id;
      const events = await this.eventService.getUpcomingEventsByOrganizerId(organizerId);
      res.status(200).json(events);
    } catch (error: any) {
      next(error);
    }
  }

  getPastEventsByOrganizerId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizerId = req.params.id;
      const events = await this.eventService.getPastEventsByOrganizerId(organizerId);
      res.status(200).json(events);
    } catch (error: any) {
      next(error);
    }
  }

  getOrganizersEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const events = await this.eventService.getOrganizersEvents(user_id);
      res.status(200).json(events);
    } catch (error: any) {
      next(error);
    }
  }

  getOrganizersUpcomingEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const events = await this.eventService.getOrganizersUpcomingEvents(user_id);
      res.status(200).json(events);
    } catch (error: any) {
      next(error);
    }
  }

  getOrganizersPastEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const events = await this.eventService.getOrganizersPastEvents(user_id);
      res.status(200).json(events);
    } catch (error: any) {
      next(error);
    }
  }

  getFeaturedEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const events = await this.eventService.getFeaturedEvents();
      res.status(200).json(events);
    } catch (error: any) {
      next(error);
    }
  }

  featureEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await this.eventService.featureEvent(req.params.id);
      res.status(200).json(event);
    } catch (error: any) {
      next(error);
    }
  }

  removeFeaturedEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await this.eventService.removeFeaturedEvent(req.params.id);
      res.status(200).json(event);
    } catch (error: any) {
      next(error);
    }
  }

  getEventAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analytics = await this.eventService.getEventAnalytics();
      res.status(200).json(analytics);
    } catch (error: any) {
      next(error);
    }
  }

  getOrganizersEventsAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const analytics = await this.eventService.getOrganizersEventsAnalytics(user_id);
      res.status(200).json(analytics);
    } catch (error: any) {
      next(error);
    }
  }

  getUpcomingEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const events = await this.eventService.getUpcomingEvents();
      res.status(200).json(events);
    } catch (error: any) {
      next(error);
    }
  }

  getPastEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const events = await this.eventService.getPastEvents();
      res.status(200).json(events);
    } catch (error: any) {
      next(error);
    }
  }

  getDeletedEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const events = await this.eventService.getDeletedEvents();
      res.status(200).json(events);
    } catch (error: any) {
      next(error);
    }
  }

  getEventsByCategoryId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const events = await this.eventService.getEventsByCategoryId(req.params.id);
      res.status(200).json(events);
    } catch (error: any) {
      next(error);
    }
  }
}

export default new EventController();
