import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { MessageStatus } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(dto: CreateContactMessageDto) {
    return this.prisma.contactMessage.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase().trim(),
        phone: dto.phone,
        subject: dto.subject,
        message: dto.message,
        status: MessageStatus.UNREAD,
      },
    });
  }

  async findAll(status?: MessageStatus, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [total, messages, unreadCount] = await Promise.all([
      this.prisma.contactMessage.count({ where }),
      this.prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.contactMessage.count({
        where: { status: MessageStatus.UNREAD },
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      unreadCount,
      messages,
    };
  }

  async markAsRead(id: string) {
    const existing = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return this.prisma.contactMessage.update({
      where: { id },
      data: { status: MessageStatus.READ },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return this.prisma.contactMessage.delete({ where: { id } });
  }
}
