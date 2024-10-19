import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityType } from '@prisma/client';

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
