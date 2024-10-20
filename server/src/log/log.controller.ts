import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  getAllLogs() {
    return this.logService.getAllLogs();
  }

}
