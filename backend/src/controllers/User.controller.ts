import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import multer from 'multer';
import UserService from '../services/User.service';
import { uploadSingle } from '../utils/ImageUpload.util';

class UserController {

  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      next(error);
    }
  }

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (error: any) {
      next(error);
    }
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
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
        const user = await this.userService.createUser(req.body, imagePath);
        res.status(201).json(user);
      } catch (error: any) {
        next(error);
      }
    });
  }

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
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
        const user = await this.userService.updateUser(req.params.id, req.body, imagePath);
        res.status(201).json(user);
      } catch (error: any) {
        next(error);
      }
    });
  }

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }

  getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id as string;
      const userProfile = await this.userService.getUserProfile(user_id);
      res.json(userProfile);
    } catch (error: any) {
      next(error);
    }
  }

  updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
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
        const updatedProfile = await this.userService.updateUserProfile(user_id, req.body, imagePath);
        res.status(201).json(updatedProfile);
      } catch (error: any) {
        next(error);
      }
    });
  }

  suspendUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.suspendUser(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }
}

export default new UserController();
