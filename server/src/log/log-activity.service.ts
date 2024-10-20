import { Injectable } from '@nestjs/common';
import { ActivityType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LogActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async logActivity(
    userId: string | null,
    type: ActivityType,
    ip: string,
    details?: string,
  ) {
    await this.prisma.userActivity.create({
      data: {
        userId,
        type,
        ip,
        details,
      },
    });
  }
}
