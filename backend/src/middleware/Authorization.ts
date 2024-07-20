import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import prisma from '../config/Prisma.config';
import { UserRole } from '../models/types';

interface TokenPayload {
  user_id: string;
  role: UserRole;
}

class AuthMiddleware {
  static async authorizeUser(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.accessToken;

    if (!token) {
      return next(createError(401, 'Authentication token not found'));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
      const user = await prisma.user.findUnique({
        where: { id: payload.user_id, is_deleted: false },
      });

      if (!user) {
        return next(createError(401, 'User not found'));
      }

      req.user = { id: user.id, role: payload.role };

      next();
    } catch (error) {
      next(createError(401, 'Invalid token'));
    }
  }

  static async authorizeAttendee(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.accessToken;

    if (!token) {
      return next(createError(401, 'Authentication token not found'));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
      const user = await prisma.user.findUnique({
        where: { id: payload.user_id, is_deleted: false },
      });

      if (!user) {
        return next(createError(401, 'User not found'));
      }

      if (payload.role !== 'attendee') {
        return next(createError(403, 'Attendee access required'));
      }

      req.user = { id: user.id, role: payload.role };

      next();
    } catch (error) {
      next(createError(401, 'Invalid token'));
    }
  }

  static async authorizeOrganizer(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.accessToken;

    if (!token) {
      return next(createError(401, 'Authentication token not found'));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
      const user = await prisma.user.findUnique({
        where: { id: payload.user_id, is_deleted: false },
      });

      if (!user) {
        return next(createError(401, 'User not found'));
      }
      
      if (payload.role !== 'organizer') {
        return next(createError(403, 'Organizer access required'));
      }

      req.user = { id: user.id, role: payload.role };

      next();
    } catch (error) {
      next(createError(401, 'Invalid token'));
    }
  }

  static async authorizeAdmin(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.accessToken;

    if (!token) {
      return next(createError(401, 'Authentication token not found'));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
      const user = await prisma.user.findUnique({
        where: { id: payload.user_id, is_deleted: false },
      });

      if (!user) {
        return next(createError(401, 'User not found'));
      }

      if (payload.role !== 'admin') {
        return next(createError(403, 'Admin access required'));
      }

      req.user = { id: user.id, role: payload.role };

      next();
    } catch (error) {
      next(createError(401, 'Invalid token'));
    }
  }
}

export default AuthMiddleware;
