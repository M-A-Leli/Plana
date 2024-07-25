import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { Attendee } from '@prisma/client';
import prisma from '../config/Prisma.config';
import sendEmail from '../utils/Email.util';

const BASE_URL = `http://localhost:${process.env.PORT}`;

class AttendeeService {
  async hashPassword(password: string): Promise<{ hash: string, salt: string }> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return { hash, salt };
  }

  async getAllAttendees(): Promise<Partial<Attendee>[]> {
    const attendees = await prisma.attendee.findMany({
      select: {
        id: true,
        bio: true,
        is_deleted: true,
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

    if (attendees.length === 0) {
      throw createError(404, 'No attendees found');
    }

    return attendees;
  }

  async getAttendeeById(id: string): Promise<Partial<Attendee> | null> {
    const attendee = await prisma.attendee.findFirst({
      where: { id, is_deleted: false, user: { is_suspended: false } },
      select: {
        id: true,
        bio: true,
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

    if (!attendee) {
      throw createError(404, 'Attendee not found');
    }

    return attendee;
  }

  async createAttendee(data: { email: string; username: string; password: string; bio: string }): Promise<Partial<Attendee>> {
    const { username, email, password, bio } = data;

    const emailExists = await prisma.user.findUnique({
      where: { email: email }
    });

    if (emailExists) {
      throw createError(409, 'Email already exists');
    }

    const usernameExits = await prisma.user.findUnique({
      where: { username: username }
    });

    if (usernameExits) {
      throw createError(409, 'Username already exists');
    }

    const { hash, salt } = await this.hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hash,
        salt: salt,
        profile_img: `${BASE_URL}/images/default_profile_image.svg`,
      },
      select: {
        id: true,
        email: true,
        username: true
      }
    });

    const attendee = await prisma.attendee.create({
      data: {
        user_id: user.id,
        bio
      },
      select: {
        id: true,
        bio: true,
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
      to: user.email,
      subject: 'Welcome to Plana',
      template: 'WelcomeAttendee',
      context: { username: user.username },
    });

    return attendee;
  }

  async updateAttendee(id: string, data: { email: string; username: string; bio: string }): Promise<Partial<Attendee> | null> {
    const { username, email, bio } = data;

    const attendee = await prisma.attendee.findFirst({ 
      where: { 
        user_id: id,
        is_deleted: false,
        user: {
          is_suspended: false
        }
      }
    });

    if (!attendee) {
      throw createError(404, 'Attendee not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: attendee.user_id },
    });

    if (!user || user.is_deleted || user.is_suspended) {
      throw createError(404, 'User not found');
    }

    if (email) {
      const existingUserWithEmail = await prisma.user.findFirst({
        where: {
          email: email,
          id: { not: user.id },
        },
      });

      if (existingUserWithEmail) {
        throw createError(409, 'Email already exists');
      }
    }

    if (username) {
      const existingUserWithUsername = await prisma.user.findFirst({
        where: {
          username: username,
          id: { not: user.id },
        },
      });

      if (existingUserWithUsername) {
        throw createError(409, 'Username already exists');
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        username,
        email,
        updated_at: new Date(),
      }
    });

    const updatedAttendee = await prisma.attendee.update({
      where: { id },
      data: {
        bio
      },
      select: {
        id: true,
        bio: true,
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

    return updatedAttendee;
  }

  async deleteAttendee(id: string) {
    const attendee = await prisma.attendee.findFirst({
      where: {
        user_id: id,
        is_deleted: false,
        user: {
          is_suspended: false
        }
      }
    });

    if (!attendee) {
      throw createError(404, 'Attendee not found');
    }

    const user = await prisma.user.findUnique({ where: { id: attendee.user_id } });

    if (!user || user.is_deleted || user.is_suspended) {
      throw createError(404, 'User not found');
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { is_deleted: true }
      });

      await tx.attendee.update({
        where: { user_id: user.id },
        data: { is_deleted: true }
      });

      await tx.organizer.delete({ where:{ user_id: id } });
    }).catch((error) => {
      throw createError(500, `Error deleting attendee: ${error.message}`);
    });
  }

  async getAttendeeProfile(id: string): Promise<Partial<Attendee> | null> {
    const attendee = await prisma.attendee.findFirst({
      where: { user_id: id, is_deleted: false, user: { is_suspended: false } },
      select: {
        id: true,
        bio: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profile_img: true
          }
        }
      }
    });

    if (!attendee) {
      throw createError(404, 'Attendee not found');
    }

    return attendee;
  }

  async updateAttendeeProfile(id: string, data: { email: string; username: string; bio: string }): Promise<Partial<Attendee> | null> {
    const { username, email, bio } = data;
  
    const attendee = await prisma.attendee.findFirst({ 
      where: { 
        user_id: id,
        is_deleted: false,
        user: {
          is_suspended: false
        }
      }
    });

    if (!attendee) {
      throw createError(404, 'Attendee not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: attendee.user_id },
    });

    if (!user || user.is_deleted || user.is_suspended) {
      throw createError(404, 'User not found');
    }
  
    if (email) {
      const existingUserWithEmail = await prisma.user.findFirst({
        where: {
          email: email,
          id: { not: user.id },
        },
      });
  
      if (existingUserWithEmail) {
        throw createError(409, 'Email already exists');
      }
    }
  
    if (username) {
      const existingUserWithUsername = await prisma.user.findFirst({
        where: {
          username: username,
          id: { not: user.id },
        },
      });
  
      if (existingUserWithUsername) {
        throw createError(409, 'Username already exists');
      }
    }
  
    await prisma.user.update({
      where: { id: user.id },
      data: {
        username: data.username,
        email: data.email,
        updated_at: new Date()
      },
    });
  
    const updatedAttendee = await prisma.attendee.update({
      where: { user_id: id },
      data: { 
        bio 
      },
      select: {
        id: true,
        bio: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profile_img: true,
          },
        },
      },
    });
  
    return updatedAttendee;
  }

  async getActiveAttendees(): Promise<Partial<Attendee>[]> {
    const attendees = await prisma.attendee.findMany({
      where: {
        is_deleted: false,
        user: {
          is_suspended: false
        }
      },
      select: {
        id: true,
        bio: true,
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

    if (attendees.length === 0) {
      throw createError(404, 'No attendees found');
    }

    return attendees;
  }

  async getSuspendedAttendees(): Promise<Partial<Attendee>[]> {
    const attendees = await prisma.attendee.findMany({
      where: {
        is_deleted: false,
        user: {
          is_suspended: true
        }
      },
      select: {
        id: true,
        bio: true,
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

    if (attendees.length === 0) {
      throw createError(404, 'No attendees found');
    }

    return attendees;
  }

  async getDeletedAttendees(): Promise<Partial<Attendee>[]> {
    const attendees = await prisma.attendee.findMany({
      where: {
        is_deleted: true
      },
      select: {
        id: true,
        bio: true,
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

    if (attendees.length === 0) {
      throw createError(404, 'No attendees found');
    }

    return attendees;
  }

  async getAttendeeAnalytics(): Promise<Object> {
    const all_attendees = await prisma.attendee.count();

    const active_attendees = await prisma.attendee.count({
      where: {
        is_deleted: false
      },
    });

    const suspended_attendees = await prisma.attendee.count({
      where: {
        is_deleted: false,
        user: {
          is_suspended: true
        }
      },
    });

    const deleted_attendees = await prisma.attendee.count({
      where: { is_deleted: true },
    });

    // ! More analytics

    return {
      all_attendees,
      active_attendees,
      suspended_attendees,
      deleted_attendees
    };
  }
}

export default AttendeeService;
