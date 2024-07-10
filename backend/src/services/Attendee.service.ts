import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { Attendee, Prisma, User } from '@prisma/client';
import prisma from '../config/Prisma.config';

const BASE_URL = `http://localhost:${process.env.PORT}`;

class AttendeeService {
  async hashPassword(password: string): Promise<{ hash: string, salt: string }> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return { hash, salt };
  }

  async getAllAttendees(): Promise<Partial<Attendee>[]> {
    const attendees = await prisma.attendee.findMany({
      where: {
        is_deleted: false
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
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

    if (attendees.length === 0) {
      throw createError(404, 'No attendees found');
    }

    return attendees;
  }

  async getAttendeeById(id: string): Promise<Partial<Attendee> | null> {
    const attendee = await prisma.attendee.findFirst({
      where: { id, is_deleted: false },
      select: {
        id: true,
        first_name: true,
        last_name: true,
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

    if (!attendee) {
      throw createError(404, 'Attendee not found');
    }

    return attendee;
  }

  async createAttendee(data: any, imagePath: string) {
    const {
      username,
      email,
      password,
      phone_number,
      ...attendeeData
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

    const attendee = await prisma.attendee.create({
      data: {
        ...attendeeData,
        user_id: user.id,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
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

    return attendee;
  }

  async updateAttendee(id: string, data: any, imagePath: string) {
    const {
      username,
      email,
      phone_number,
      ...attendeeData
    } = data;

    const attendee = await prisma.attendee.findUnique({ where: { id } });

    if (!attendee || attendee.is_deleted) {
      throw createError(404, 'Attendee not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: attendee.user_id },
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

    const updatedAttendee = await prisma.attendee.update({
      where: { id },
      data: attendeeData,
      select: {
        id: true,
        first_name: true,
        last_name: true,
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

    return updatedAttendee;
  }

  async deleteAttendee(id: string) {
    const attendee = await prisma.attendee.findUnique({ where: { id } });

    if (!attendee || attendee.is_deleted) {
      throw createError(404, 'Attendee not found');
    }

    const user = await prisma.user.findUnique({ where: { id: attendee.user_id } });

    if (!user || user.is_deleted) {
      throw createError(404, 'User not found');
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { is_deleted: true }
      });

      await tx.attendee.update({
        where: { id },
        data: { is_deleted: true }
      });
    }).catch((error) => {
      throw createError(500, `Error deleting attendee: ${error.message}`);
    });
  }

  async getAttendeeProfile(id: string): Promise<Partial<User> | null> {
    const user = await prisma.user.findFirst({
      where: { id, is_deleted: false },
      select: {
        id: true,
        username: true,
        email: true,
        phone_number: true,
        profile_img: true,
        attendees: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            bio: true,
          }
        }
      }
    });

    if (!user) {
      throw createError(404, 'User not found');
    }

    return user;
  }

  async updateAttendeeProfile(id: string, data: Partial<User>, imagePath: string): Promise<Partial<User> | null> {
    const {
      username,
      email,
      phone_number,
      ...attendeeData
    } = data;

    const attendee = await prisma.attendee.findUnique({ where: { id } });

    if (!attendee || attendee.is_deleted) {
      throw createError(404, 'Attendee not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: attendee.user_id },
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

    const updatedprofile = await prisma.attendee.update({
      where: { id },
      data: attendeeData,
      select: {
        id: true,
        first_name: true,
        last_name: true,
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

export default AttendeeService;
