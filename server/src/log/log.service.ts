import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LogService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllLogs() {
    const logs = await this.prisma.userActivity.findMany({
      select: {
        id: true,
        type: true,
        ip: true,
        details: true,
        createdAt: true,
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });
    return {
      success: Boolean(logs.length),
      message: logs.length
        ? 'Logs fetched successfully'
        : 'No logs found',
      data: logs,
    };
  }
}
