import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { addMinutes } from 'date-fns';
import prisma from '../config/Prisma.config';
import { PasswordResetCode } from '@prisma/client';
import sendEmail from '../utils/Email.util';

class PasswordResetService {
  async hashPassword(password: string): Promise<{ hash: string, salt: string }> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return { hash, salt };
  }

  async sendPasswordResetCode(email: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw createError(404, 'User not found');
    }

    const resetCode = randomBytes(3).toString('hex').toUpperCase();
    const expirationTime = addMinutes(new Date(), 15);

    await prisma.passwordResetCode.create({
      data: {
        user_id: user.id,
        code: resetCode,
        expires_at: expirationTime
      },
    });

    // Send reset code via email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      template: 'PasswordReset',
      context: { username: user.username, resetCode }
    });
  }

  async verifyPasswordResetCode(code: string): Promise<Partial<PasswordResetCode>> {
    const passwordReset = await prisma.passwordResetCode.findFirst({
      where: {
        code,
        is_valid: true,
        expires_at: { gt: new Date() },
      },
      select: {
        user_id: true
      }
    });

    if (!passwordReset) {
      throw createError(400, 'Invalid or expired reset code');
    }

    return passwordReset;
  }

  async resetPassword(id: string, newPassword: string): Promise<void> {
    const { hash, salt } = await this.hashPassword(newPassword);

    await prisma.user.update({
      where: { id },
      data: {
        password: hash,
        salt: salt
      },
    });

    await prisma.passwordResetCode.updateMany({
      where: { user_id: id },
      data: { is_valid: false },
    });
  }
}

export default PasswordResetService;
