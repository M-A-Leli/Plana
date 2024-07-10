import { Request, Response, NextFunction } from 'express';
import NotificationService from '../services/Notification.service';

class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  getAllNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await this.notificationService.getAllNotifications();
      res.status(200).json(notifications);
    } catch (error: any) {
      next(error);
    }
  }

  getNotificationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await this.notificationService.getNotificationById(req.params.id);
      res.status(200).json(notification);
    } catch (error: any) {
      next(error);
    }
  }

  createNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await this.notificationService.createNotification(req.body);
      res.status(201).json(notification);
    } catch (error: any) {
      next(error);
    }
  }

  deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.notificationService.deleteNotification(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }

  getNotificationsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const notifications = await this.notificationService.getNotificationsByUserId(user_id);
      res.status(200).json(notifications);
    } catch (error: any) {
      next(error);
    }
  }

  getUnreadNotificationsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const notifications = await this.notificationService.getUnreadNotificationsByUserId(user_id);
      res.status(200).json(notifications);
    } catch (error: any) {
      next(error);
    }
  }

  markNotificationAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.notificationService.markNotificationAsRead(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }
}

export default new NotificationController();
