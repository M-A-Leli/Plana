import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { Organizer, Prisma, User } from '@prisma/client';
import prisma from '../config/Prisma.config';

const BASE_URL = `http://localhost:${process.env.PORT}`;

class OrganizerService {
  async hashPassword(password: string): Promise<{ hash: string, salt: string }> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return { hash, salt };
  }

  async getAllOrganizers(): Promise<Partial<Organizer>[]> {
    const organizers = await prisma.organizer.findMany({
      where: {
        is_deleted: false
      },
      select: {
        id: true,
        company: true,
        bio: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone_number: true,
            profile_img: true
          },
        },
      }
    });

    if (organizers.length === 0) {
      throw createError(404, 'No organizers found');
    }

    return organizers;
  }

  async getOrganizerById(id: string): Promise<Partial<Organizer> | null> {
    const organizer = await prisma.organizer.findFirst({
      where: { id, is_deleted: false },
      select: {
        id: true,
        company: true,
        bio: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone_number: true,
            profile_img: true
          },
        },
      }
    });

    if (!organizer) {
      throw createError(404, 'Organizer not found');
    }

    return organizer;
  }

  async createOrganizer(data: any, imagePath: string) {
    const {
      username,
      email,
      password,
      phone_number,
      ...organizerData
    } = data;

    const emailExists = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (emailExists) {
      throw createError(409, 'Email already exists');
    }

    const usernameExits = await prisma.user.findUnique({
      where: { username: data.username }
    });

    if (usernameExits) {
      throw createError(409, 'Username already exists');
    }

    const phoneNumberExists = await prisma.user.findUnique({
      where: { phone_number: data.phone_number }
    });

    if (phoneNumberExists) {
      throw createError(409, 'Phone number already exists');
    }

    const { hash, salt } = await this.hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hash,
        salt: salt,
        phone_number,
        profile_img: `${BASE_URL}/images/${imagePath.split('/').pop()}`,
      },
      select: {
        id: true
      }
    });

    const organizer = await prisma.organizer.create({
      data: {
        ...organizerData,
        user_id: user.id,
      },
      select: {
        id: true,
        company: true,
        bio: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone_number: true,
            profile_img: true
          },
        },
      }
    });

    return organizer;
  }

  async updateOrganizer(id: string, data: any, imagePath: string) {
    const {
      username,
      email,
      phone_number,
      ...organizerData
    } = data;

    const organizer = await prisma.organizer.findUnique({ where: { id } });

    if (!organizer || organizer.is_deleted) {
      throw createError(404, 'Organizer not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: organizer.user_id },
    });

    if (!user || user.is_deleted) {
      throw createError(404, 'User not found');
    }

    if (data.email) {
      const existingUserWithEmail = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: user.id },
        },
      });

      if (existingUserWithEmail) {
        throw createError(409, 'Email already exists');
      }
    }

    if (data.username) {
      const existingUserWithUsername = await prisma.user.findFirst({
        where: {
          username: data.username,
          id: { not: user.id },
        },
      });

      if (existingUserWithUsername) {
        throw createError(409, 'Username already exists');
      }
    }

    if (data.phone_number) {
      const existingUserWithPhoneNumber = await prisma.user.findFirst({
        where: {
          phone_number: data.phone_number,
          id: { not: user.id },
        },
      });

      if (existingUserWithPhoneNumber) {
        throw createError(409, 'Phone number already exists');
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        username,
        email,
        phone_number,
        profile_img: imagePath
      }
    });

    const updatedOrganizer = await prisma.organizer.update({
      where: { id },
      data: organizerData,
      select: {
        id: true,
        company: true,
        bio: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone_number: true,
            profile_img: true
          },
        },
      }
    });

    return updatedOrganizer;
  }

  async deleteOrganizer(id: string) {
    const organizer = await prisma.organizer.findUnique({ where: { id } });

    if (!organizer || organizer.is_deleted) {
      throw createError(404, 'Organizer not found');
    }

    const user = await prisma.user.findUnique({ where: { id: organizer.user_id } });

    if (!user || user.is_deleted) {
      throw createError(404, 'User not found');
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { is_deleted: true }
      });

      await tx.organizer.update({
        where: { id },
        data: { is_deleted: true }
      });
    }).catch((error) => {
      throw createError(500, `Error deleting organizer: ${error.message}`);
    });
  }

  async getOrganizerProfile(id: string): Promise<Partial<User> | null> {
    const user = await prisma.user.findFirst({
      where: { id, is_deleted: false },
      select: {
        id: true,
        username: true,
        email: true,
        phone_number: true,
        profile_img: true,
        organizers: {
          select: {
            id: true,
            company: true,
            bio: true
          }
        }
      }
    });

    if (!user) {
      throw createError(404, 'User not found');
    }

    return user;
  }

  async updateOrganizerProfile(id: string, data: Partial<User>, imagePath: string): Promise<Partial<User> | null> {
    const {
      username,
      email,
      phone_number,
      ...organizerData
    } = data;

    const organizer = await prisma.organizer.findUnique({ where: { id } });

    if (!organizer || organizer.is_deleted) {
      throw createError(404, 'Organizer not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: organizer.user_id },
    });

    if (!user || user.is_deleted) {
      throw createError(404, 'User not found');
    }

    if (data.email) {
      const existingUserWithEmail = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: user.id },
        },
      });

      if (existingUserWithEmail) {
        throw createError(409, 'Email already exists');
      }
    }

    if (data.username) {
      const existingUserWithUsername = await prisma.user.findFirst({
        where: {
          username: data.username,
          id: { not: user.id },
        },
      });

      if (existingUserWithUsername) {
        throw createError(409, 'Username already exists');
      }
    }

    if (data.phone_number) {
      const existingUserWithPhoneNumber = await prisma.user.findFirst({
        where: {
          phone_number: data.phone_number,
          id: { not: user.id },
        },
      });

      if (existingUserWithPhoneNumber) {
        throw createError(409, 'Phone number already exists');
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        username,
        email,
        phone_number,
        profile_img: imagePath
      }
    });

    const updatedprofile = await prisma.organizer.update({
      where: { id },
      data: organizerData,
      select: {
        id: true,
        company: true,
        bio: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone_number: true,
            profile_img: true
          }
        }
      }
    });

    return updatedprofile;
  }
}

export default OrganizerService;
