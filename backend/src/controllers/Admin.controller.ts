import { Request, Response, NextFunction } from 'express';
import AdminService from '../services/Admin.service';

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
    try {
      const user_id = req.user?.id as string;
      const admin = await this.adminService.createAdmin(user_id, req.body);
      res.status(201).json(admin);
    } catch (error: any) {
      next(error);
    }
  }

  updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const admin = await this.adminService.updateAdmin(user_id, req.params.id, req.body);
      res.status(201).json(admin);
    } catch (error: any) {
      next(error);
    }
  }

  deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      await this.adminService.deleteAdmin(user_id, req.params.id);
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
    try {
      const user_id = req.user?.id as string;
      const updatedProfile = await this.adminService.updateAdminProfile(user_id, req.body);
      res.status(201).json(updatedProfile);
    } catch (error: any) {
      next(error);
    }
  }

  getActiveAdmins = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admins = await this.adminService.getActiveAdmins();
      res.status(200).json(admins);
    } catch (error: any) {
      next(error);
    }
  }

  getSuspendedAdmins = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admins = await this.adminService.getSuspendedAdmins();
      res.status(200).json(admins);
    } catch (error: any) {
      next(error);
    }
  }

  getDeletedAdmins = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admins = await this.adminService.getDeletedAdmins();
      res.status(200).json(admins);
    } catch (error: any) {
      next(error);
    }
  }

  getAdminAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analytics = await this.adminService.getAdminAnalytics();
      res.status(200).json(analytics);
    } catch (error: any) {
      next(error);
    }
  }
}

export default new AdminController();
