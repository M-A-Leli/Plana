import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { Admin } from '@prisma/client';
import prisma from '../config/Prisma.config';
import sendEmail from '../utils/Email.util';

const BASE_URL = `http://localhost:${process.env.PORT}`;

class AdminService {
  static generatePassword(length: number = 12): string {
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    const allChars = upperCase + lowerCase + numbers + specialChars;
    const getRandomChar = (chars: string) => chars[Math.floor(Math.random() * chars.length)];

    let password = '';
    password += getRandomChar(upperCase);
    password += getRandomChar(lowerCase);
    password += getRandomChar(numbers);
    password += getRandomChar(specialChars);

    for (let i = 4; i < length; i++) {
      password += getRandomChar(allChars);
    }

    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  async hashPassword(password: string): Promise<{ hash: string, salt: string }> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return { hash, salt };
  }

  async getAllAdmins(): Promise<Partial<Admin>[]> {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        level: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profile_img: true
          },
        },
      }
    });

    if (admins.length === 0) {
      throw createError(404, 'No admins found');
    }

    return admins;
  }

  async getAdminById(id: string): Promise<Partial<Admin> | null> {
    const admin = await prisma.admin.findFirst({
      where: { id, is_deleted: false, user: { is_suspended: false } },
      select: {
        id: true,
        level: true,
        is_deleted: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profile_img: true,
            is_suspended: true,
          },
        },
      }
    });

    if (!admin) {
      throw createError(404, 'Admin not found');
    }

    return admin;
  }

  async createAdmin(id: string, data: { email: string; username: string }): Promise<Partial<Admin> | null> {
    const { email, username } = data;

    const emailExists = await prisma.user.findUnique({
      where: { email }
    });

    if (emailExists) {
      throw createError(409, 'Email already exists');
    }

    const usernameExists = await prisma.user.findUnique({
      where: { username }
    });

    if (usernameExists) {
      throw createError(409, 'Username already exists');
    }

    const currentAdmin = await prisma.admin.findUnique({
      where: { user_id: id }
    });

    if (!currentAdmin || currentAdmin.is_deleted) {
      throw createError(404, 'Current admin not found');
    }

    const generatedPassword = AdminService.generatePassword();

    const { hash, salt } = await this.hashPassword(generatedPassword);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hash,
        salt,
        profile_img: `${BASE_URL}/images/default_profile_image.svg`,
      },
      select: {
        id: true
      }
    });

    const newLevel = currentAdmin.level + 1;

    const admin = await prisma.admin.create({
      data: {
        user_id: user.id,
        level: newLevel
      },
      select: {
        id: true,
        level: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profile_img: true
          },
        },
      }
    });

    await sendEmail({
      to: email,
      subject: 'Welcome to the Admin Team',
      template: 'WelcomeAdmin',
      context: {
        username,
        email,
        password: generatedPassword,
        loginUrl: `http://localhost:4200/login`
      }
    });

    return admin;
  }

  async updateAdmin(currentAdminId: string, targetAdminId: string, data: { email: string; username: string }): Promise<Partial<Admin> | null> {
    const { email, username } = data;

    const currentAdmin = await prisma.admin.findFirst({
      where: { 
        user_id: currentAdminId,
        is_deleted: false,
        user: {
          is_suspended: false
        }
      }
    });

    if (!currentAdmin) {
      throw createError(404, 'Current admin not found');
    }

    const targetAdmin = await prisma.admin.findFirst({
      where: { 
        id: targetAdminId,
        is_deleted: false,
        user: {
          is_suspended: false
        }
      }
    });

    if (!targetAdmin) {
      throw createError(404, 'Target admin not found');
    }

    if (currentAdmin.level >= targetAdmin.level) {
      throw createError(403, 'Permission Denied: Insufficient privileges');
    }

    if (email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });

      if (emailExists && emailExists.id !== targetAdmin.user_id) {
        throw createError(409, 'Email already exists');
      }
    }

    if (username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username }
      });

      if (usernameExists && usernameExists.id !== targetAdmin.user_id) {
        throw createError(409, 'Username already exists');
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetAdmin.user_id },
      data: {
        email: email,
        username: username,
        updated_at: new Date(),
      },
      select: {
        id: true,
        email: true,
        username: true,
        profile_img: true,
      }
    });

    const updatedAdmin = {
      id: targetAdmin.id,
      level: targetAdmin.level,
      user: updatedUser
    };

    return updatedAdmin;
  }

  async deleteAdmin(currentAdminId: string, targetAdminId: string) {
    const currentAdmin = await prisma.admin.findFirst({
      where: {
        user_id: currentAdminId,
        is_deleted: false,
        user: {
          is_suspended: false
        }
      }
    });

    if (!currentAdmin) {
      throw createError(404, 'Current admin not found');
    }

    const targetAdmin = await prisma.admin.findUnique({
      where: { id: targetAdminId }
    });

    if (!targetAdmin || targetAdmin.is_deleted) {
      throw createError(404, 'Target admin not found');
    }

    if (currentAdmin.level >= targetAdmin.level) {
      throw createError(403, 'Permission Denied: Insufficient privileges');
    }

    const user = await prisma.user.findUnique({ where: { id: targetAdmin.user_id } });

    if (!user || user.is_deleted || user.is_suspended) {
      throw createError(404, 'User not found');
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { is_deleted: true }
      });

      await tx.admin.update({
        where: { id: targetAdminId },
        data: { is_deleted: true }
      });
    }).catch((error) => {
      throw createError(500, `Error deleting admin: ${error.message}`);
    });
  }

  async getAdminProfile(userId: string): Promise<Partial<Admin> | null> {
    const admin = await prisma.admin.findFirst({
      where: { user_id: userId, is_deleted: false, user: { is_suspended: false } },
      select: {
        id: true,
        level: true,
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            profile_img: true
          }
        }
      }
    });

    if (!admin) {
      throw createError(404, 'Admin not found');
    }

    return admin;
  }

  async updateAdminProfile(userId: string, data: { email: string; username: string }): Promise<Partial<Admin> | null> {
    const { email, username } = data;

    const admin = await prisma.admin.findFirst({
      where: {
        user_id: userId,
        is_deleted: false,
        user: {
          is_suspended: false
        }
      }
    });

    if (!admin) {
      throw createError(404, 'Admin not found');
    }

    if (email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });

      if (emailExists && emailExists.id !== admin.user_id) {
        throw createError(409, 'Email already exists');
      }
    }

    if (username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username }
      });

      if (usernameExists && usernameExists.id !== admin.user_id) {
        throw createError(409, 'Username already exists');
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: admin.user_id },
      data: {
        email: email,
        username: username,
        updated_at: new Date()
      },
      select: {
        id: true,
        email: true,
        username: true,
        profile_img: true,
      }
    });

    const updatedAdmin = {
      id: admin.id,
      level: admin.level,
      user: updatedUser
    };

    return updatedAdmin;
  }

  async getActiveAdmins(): Promise<Partial<Admin>[]> {
    const admins = await prisma.admin.findMany({
      where: {
        is_deleted: false,
        user: {
          is_suspended: false
        }
      },
      select: {
        id: true,
        is_deleted:true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profile_img: true,
            is_suspended: true
          },
        },
      }
    });

    if (admins.length === 0) {
      throw createError(404, 'No admins found');
    }

    return admins;
  }

  async getSuspendedAdmins(): Promise<Partial<Admin>[]> {
    const admins = await prisma.admin.findMany({
      where: {
        is_deleted: false,
        user: {
          is_suspended: true
        }
      },
      select: {
        id: true,
        is_deleted:true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profile_img: true,
            is_suspended: true
          },
        },
      }
    });

    if (admins.length === 0) {
      throw createError(404, 'No admins found');
    }

    return admins;
  }

  async getDeletedAdmins(): Promise<Partial<Admin>[]> {
    const admins = await prisma.admin.findMany({
      where: {
        is_deleted: true
      },
      select: {
        id: true,
        is_deleted:true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profile_img: true,
            is_suspended: true
          },
        },
      }
    });

    if (admins.length === 0) {
      throw createError(404, 'No admins found');
    }

    return admins;
  }

  async getAdminAnalytics(): Promise<Object> {
    const all_admins = await prisma.admin.count();

    const active_admins = await prisma.admin.count({
      where: {
        is_deleted: false
      },
    });

    const suspended_admins = await prisma.admin.count({
      where: {
        is_deleted: false,
        user: {
          is_suspended: true
        }
      },
    });

    const deleted_admins = await prisma.admin.count({
      where: { is_deleted: true },
    });

    // ! More analytics

    return {
      all_admins,
      active_admins,
      suspended_admins,
      deleted_admins
    };
  }
}

export default AdminService;
