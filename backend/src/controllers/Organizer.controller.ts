import { Request, Response, NextFunction } from 'express';
import OrganizerService from '../services/Organizer.service';

class OrganizerController {

  private organizerService: OrganizerService;

  constructor() {
    this.organizerService = new OrganizerService();
  }

  getAllOrganizers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizers = await this.organizerService.getAllOrganizers();
      res.status(200).json(organizers);
    } catch (error: any) {
      next(error);
    }
  }

  getOrganizerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizer = await this.organizerService.getOrganizerById(req.params.id);
      res.status(200).json(organizer);
    } catch (error: any) {
      next(error);
    }
  }

 createOrganizer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const response = await this.organizerService.createOrganizer(user_id, req.body);
      res.status(201).json(response);
    } catch (error: any) {
      next(error);
    }
  }

 approveOrganizer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizer = await this.organizerService.approveOrganizer(req.params.id);
      res.status(200).json(organizer);
    } catch (error: any) {
      next(error);
    }
  }

 revokeOrganizer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizer = await this.organizerService.revokeOrganizer(req.params.id);
      res.status(200).json(organizer);
    } catch (error: any) {
      next(error);
    }
  }

  updateOrganizer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizer = await this.organizerService.updateOrganizer(req.params.id, req.body);
      res.status(201).json(organizer);
    } catch (error: any) {
      next(error);
    }
  }

  deleteOrganizer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.organizerService.deleteOrganizer(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }

  getOrganizerProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const organizerProfile = await this.organizerService.getOrganizerProfile(user_id);
      res.json(organizerProfile);
    } catch (error: any) {
      next(error);
    }
  }

  updateOrganizerProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const updatedProfile = await this.organizerService.updateOrganizerProfile(user_id, req.body);
      res.status(201).json(updatedProfile);
    } catch (error: any) {
      next(error);
    }
  }

  getActiveOrganizers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizers = await this.organizerService.getActiveOrganizers();
      res.status(200).json(organizers);
    } catch (error: any) {
      next(error);
    }
  }

  getApprovedOrganizers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizers = await this.organizerService.getApprovedOrganizers();
      res.status(200).json(organizers);
    } catch (error: any) {
      next(error);
    }
  }

  getDeletedOrganizers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizers = await this.organizerService.getDeletedOrganizers();
      res.status(200).json(organizers);
    } catch (error: any) {
      next(error);
    }
  }

  getOrganizerAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analytics = await this.organizerService.getOrganizerAnalytics();
      res.status(200).json(analytics);
    } catch (error: any) {
      next(error);
    }
  }
}

export default new OrganizerController();
