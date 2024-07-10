import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import AuthService from '../services/Auth.service';
import { UserRole } from '../models/types';

interface TokenPayload {
  user_id: string;
  role: UserRole;
}

interface User {
  id: string;
  password?: string;
  admin: { id: string } | null;
  attendees: { id: string } | null;
  organizers: { id: string } | null;
}

class AuthController {
  static generateAccessToken(user: User): string {
    const payload: TokenPayload = {
      user_id: user.id,
      role: user.admin ? 'admin' : user.organizers ? 'organizer' : 'attendee'
    };

    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  }

  static generateRefreshToken(user: User): string {
    const payload: TokenPayload = {
      user_id: user.id,
      role: user.admin ? 'admin' : user.organizers ? 'organizer' : 'attendee',
    };

    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await AuthService.login(email, password);

      const accessToken = AuthController.generateAccessToken(user);
      const refreshToken = AuthController.generateRefreshToken(user);

      res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

      const redirectUrl = user.admin ? '/admin' : user.organizers ? '/organizer' : '/attendee';

      res.status(200).json({ redirectUrl });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh Token not found' });
    }

    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as TokenPayload;

      const user = await AuthService.findUserByID(payload.user_id);

      const newAccessToken = AuthController.generateAccessToken(user);

      res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(401).json({ message: 'Invalid Refresh Token' });
    }
  }

  static logout(req: Request, res: Response, next: NextFunction) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ redirectUrl: '/' });
  }
}

export default AuthController;
