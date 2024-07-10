import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import multer from 'multer';
import OrganizerService from '../services/Organizer.service';
import { uploadSingle } from '../utils/ImageUpload.util';

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
    uploadSingle(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return next(createError(400, err.message));
      } else if (err) {
        return next(createError(400, err.message));
      }

      if (!req.file) {
        return next(createError(400, 'No file uploaded'));
      }

      try {
        const imagePath = req.file.path;
        const organizer = await this.organizerService.createOrganizer(req.body, imagePath);
        res.status(201).json(organizer);
      } catch (error: any) {
        next(error);
      }
    });
  }

  updateOrganizer = async (req: Request, res: Response, next: NextFunction) => {
    uploadSingle(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return next(createError(400, err.message));
      } else if (err) {
        return next(createError(400, err.message));
      }

      if (!req.file) {
        return next(createError(400, 'No file uploaded'));
      }

      try {
        const imagePath = req.file.path;
        const organizer = await this.organizerService.updateOrganizer(req.params.id, req.body, imagePath);
        res.status(201).json(organizer);
      } catch (error: any) {
        next(error);
      }
    });
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
    uploadSingle(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return next(createError(400, err.message));
      } else if (err) {
        return next(createError(400, err.message));
      }

      if (!req.file) {
        return next(createError(400, 'No file uploaded'));
      }

      try {
        const user_id = req.user?.id as string;
        const imagePath = req.file.path;
        const updatedProfile = await this.organizerService.updateOrganizerProfile(user_id, req.body, imagePath);
        res.status(201).json(updatedProfile);
      } catch (error: any) {
        next(error);
      }
    });
  }
}

export default new OrganizerController();
