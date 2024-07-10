import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import multer from 'multer';
import AdminService from '../services/Admin.service';
import { uploadSingle } from '../utils/ImageUpload.util';

class AdminController {

  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  getAllAdmins = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admins = await this.adminService.getAllAdmins();
      res.status(200).json(admins);
    } catch (error: any) {
      next(error);
    }
  }

  getAdminById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = await this.adminService.getAdminById(req.params.id);
      res.status(200).json(admin);
    } catch (error: any) {
      next(error);
    }
  }

  createAdmin = async (req: Request, res: Response, next: NextFunction) => {
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
        const admin = await this.adminService.createAdmin(req.body, imagePath);
        res.status(201).json(admin);
      } catch (error: any) {
        next(error);
      }
    });
  }

  updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
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
        const admin = await this.adminService.updateAdmin(req.params.id, req.body, imagePath);
        res.status(201).json(admin);
      } catch (error: any) {
        next(error);
      }
    });
  }

  deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.adminService.deleteAdmin(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }

  getAdminProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const adminProfile = await this.adminService.getAdminProfile(user_id);
      res.json(adminProfile);
    } catch (error: any) {
      next(error);
    }
  }

  updateAdminProfile = async (req: Request, res: Response, next: NextFunction) => {
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
        const updatedProfile = await this.adminService.updateAdminProfile(user_id, req.body, imagePath);
        res.status(201).json(updatedProfile);
      } catch (error: any) {
        next(error);
      }
    });
  }
}

export default new AdminController();
