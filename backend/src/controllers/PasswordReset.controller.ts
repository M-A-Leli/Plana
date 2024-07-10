import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import PasswordResetService from '../services/PasswordReset.service';

class PasswordResetController {

  private passwordResetService: PasswordResetService;

  constructor() {
    this.passwordResetService = new PasswordResetService();
  }

  generateResetToken = (user_id: string): string => {
    const payload = {
      user_id: user_id
    };
    
    return jwt.sign(payload, process.env.JWT_RESET_SECRET as string, { expiresIn: '15m' });
  }

  sendPasswordResetCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.passwordResetService.sendPasswordResetCode(req.body.email);
      res.status(200).json({ message: 'Password reset code sent' });
    } catch (error) {
      next(error);
    }
  }

  verifyPasswordResetCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, reset_code } = req.body;
      const passwordResetToken = await this.passwordResetService.verifyPasswordResetCode(user_id, reset_code);

      const resetToken = this.generateResetToken(passwordResetToken.user_id as string);

      res.cookie('resetToken', resetToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

      res.status(200).json({ message: 'Reset code verified' });
    } catch (error) {
      next(error);
    }
  }

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resetToken = req.cookies.resetToken;

      if (!resetToken) {
        return res.status(401).json({ message: 'Reset token not found' });
      }

      const decodedToken = jwt.verify(resetToken, process.env.JWT_RESET_SECRET as string) as { user_id: string };

      await this.passwordResetService.resetPassword(decodedToken.user_id, req.body.password);

      res.clearCookie('resetToken');

      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      next(error);
    }
  }
}

export default new PasswordResetController();
