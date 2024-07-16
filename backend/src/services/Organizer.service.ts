import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { Organizer, Prisma, User } from '@prisma/client';
import prisma from '../config/Prisma.config';
import sendEmail from '../utils/Email.util';

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
        is_deleted: false,
        user: {
          is_suspended: false
        }
      },
      select: {
        id: true,
        company: true,
        bio: true,
        approved: true,
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

    if (organizers.length === 0) {
      throw createError(404, 'No organizers found');
    }

    return organizers;
  }

  async getOrganizerById(id: string): Promise<Partial<Organizer> | null> {
    const organizer = await prisma.organizer.findFirst({
      where: { id, is_deleted: false, user: { is_suspended: false } },
      select: {
        id: true,
        company: true,
        bio: true,
        approved: true,
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

    if (!organizer) {
      throw createError(404, 'Organizer not found');
    }

    return organizer;
  }

  async createOrganizer(userId: string, data: { company: string; bio?: string }): Promise<Partial<Organizer> | null> {
    const { company, bio } = data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.is_deleted || user.is_suspended) {
      throw createError(404, 'User not found');
    }

    const existingOrganizer = await prisma.organizer.findFirst({
      where: {
        company,
      },
    });

    if (existingOrganizer) {
      throw createError(409, 'Company name is already taken.');
    }

    const organizer = await prisma.organizer.create({
      data: {
        user_id: userId,
        company,
        bio,
      },
      select: {
        id: true,
        company: true,
        bio: true,
        approved: true,
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

    try {
      await sendEmail({
        to: user.email,
        subject: 'Organizer Request Received',
        template: 'OrganizerRequest',
        context: { username: user.username },
      });
    } catch (emailError: any) {
      throw createError(500, `Failed to send email: ${emailError.message}`);
    }

    return organizer;
  }

  async approveOrganizer(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.is_deleted || user.is_suspended) {
      throw createError(404, 'User not found');
    }

    const attendee = await prisma.attendee.findFirst({
      where: {
        user_id: userId,
        is_deleted: false,
        user: {
          is_suspended: false,
        },
      },
    });

    if (!attendee) {
      throw createError(404, 'Attendee not found');
    }

    try {
      await prisma.$transaction(async (tx) => {
        await tx.attendee.delete({ where: { user_id: userId } });

        await tx.organizer.update({
          where: { user_id: userId },
          data: { approved: true },
        });
      });

      try {
        await sendEmail({
          to: user.email,
          subject: 'Organizer Request Approved',
          template: 'WelcomeOrganizer',
          context: { username: user.username },
        });
      } catch (emailError: any) {
        throw createError(500, `Failed to send email: ${emailError.message}`);
      }
    } catch (error: any) {
      throw createError(500, `Error approving organizer: ${error.message}`);
    }
  }

  async updateOrganizer(id: string, data: { email: string; username: string; company: string; bio: string }): Promise<Partial<Organizer> | null> {
    const { username, email, company, bio } = data;

    const organizer = await prisma.organizer.findFirst({
      where: {
        user_id: id,
        is_deleted: false,
        user: {
          is_suspended: false
        }
      }
    });

    if (!organizer) {
      throw createError(404, 'Organizer not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: organizer.user_id },
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

    if (company) {
      const existingOrganizer = await prisma.organizer.findFirst({
        where: {
          company: company,
          user_id: { not: user.id },
        },
      });

      if (existingOrganizer) {
        throw createError(409, 'Company name is already taken.');
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

    const updatedOrganizer = await prisma.organizer.update({
      where: { id },
      data: {
        company,
        bio
      },
      select: {
        id: true,
        company: true,
        bio: true,
        approved: true,
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

    return updatedOrganizer;
  }

  async deleteOrganizer(id: string) {
    const organizer = await prisma.organizer.findFirst({
      where: {
        user_id: id,
        is_deleted: false,
        user: {
          is_suspended: false
        }
      }
    });

    if (!organizer) {
      throw createError(404, 'Organizer not found');
    }

    const user = await prisma.user.findUnique({ where: { id: organizer.user_id } });

    if (!user || user.is_deleted || user.is_suspended) {
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

  async getOrganizerProfile(id: string): Promise<Partial<Organizer> | null> {
    const organizer = await prisma.organizer.findFirst({
      where: { id, is_deleted: false, user: { is_suspended: false } },
      select: {
        id: true,
        company: true,
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

    if (!organizer) {
      throw createError(404, 'Organizer not found');
    }

    return organizer;
  }

  async updateOrganizerProfile(id: string, data: { email: string; username: string; company: string; bio: string }): Promise<Partial<Organizer> | null> {
    const { username, email, company, bio } = data;

    const organizer = await prisma.organizer.findFirst({
      where: {
        user_id: id,
        is_deleted: false,
        user: {
          is_suspended: false
        }
      }
    });

    if (!organizer) {
      throw createError(404, 'Organizer not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: organizer.user_id },
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

    if (company) {
      const existingOrganizer = await prisma.organizer.findFirst({
        where: {
          company: company,
          user_id: { not: user.id },
        },
      });

      if (existingOrganizer) {
        throw createError(409, 'Company name is already taken.');
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

    const updatedOrganizer = await prisma.organizer.update({
      where: { id },
      data: {
        company,
        bio
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
            profile_img: true,
          },
        },
      },
    });

    return updatedOrganizer;
  }

  async getOrganizerAnalytics(): Promise<Object> {
    const all_organizers = await prisma.organizer.count();

    const active_organizers = await prisma.organizer.count({
      where: {
        is_deleted: false
      },
    });

    const approved_organizers = await prisma.organizer.count({
      where: {
        approved: true
      },
    });

    const deleted_organizers = await prisma.organizer.count({
      where: { is_deleted: true },
    });

    // ! More analytics

    return {
      all_organizers,
      active_organizers,
      deleted_organizers,
      approved_organizers
    };
  }
}

export default OrganizerService;
