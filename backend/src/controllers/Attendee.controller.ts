import { Request, Response, NextFunction } from 'express';
import AttendeeService from '../services/Attendee.service';

class AttendeeController {

  private attendeeService: AttendeeService;

  constructor() {
    this.attendeeService = new AttendeeService();
  }

  getAllAttendees = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attendees = await this.attendeeService.getAllAttendees();
      res.status(200).json(attendees);
    } catch (error: any) {
      next(error);
    }
  }

  getAttendeeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attendee = await this.attendeeService.getAttendeeById(req.params.id);
      res.status(200).json(attendee);
    } catch (error: any) {
      next(error);
    }
  }

  createAttendee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attendee = await this.attendeeService.createAttendee(req.body);
      res.status(201).json(attendee);
    } catch (error: any) {
      next(error);
    }
  }

  updateAttendee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attendee = await this.attendeeService.updateAttendee(req.params.id, req.body);
      res.status(201).json(attendee);
    } catch (error: any) {
      next(error);
    }
  }

  deleteAttendee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      await this.attendeeService.deleteAttendee(user_id);
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }

  getAttendeeProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const attendeeProfile = await this.attendeeService.getAttendeeProfile(user_id);
      res.json(attendeeProfile);
    } catch (error: any) {
      next(error);
    }
  }

  updateAttendeeProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const updatedProfile = await this.attendeeService.updateAttendeeProfile(user_id, req.body);
      res.status(201).json(updatedProfile);
    } catch (error: any) {
      next(error);
    }
  }

  getActiveAttendees = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attendees = await this.attendeeService.getActiveAttendees();
      res.status(200).json(attendees);
    } catch (error: any) {
      next(error);
    }
  }

  getSuspendedAttendees = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attendees = await this.attendeeService.getSuspendedAttendees();
      res.status(200).json(attendees);
    } catch (error: any) {
      next(error);
    }
  }

  getDeletedAttendees = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attendees = await this.attendeeService.getDeletedAttendees();
      res.status(200).json(attendees);
    } catch (error: any) {
      next(error);
    }
  }

  getAttendeeAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analytics = await this.attendeeService.getAttendeeAnalytics();
      res.status(200).json(analytics);
    } catch (error: any) {
      next(error);
    }
  }
}

export default new AttendeeController();
