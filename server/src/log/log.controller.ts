import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogService } from './log.service';


@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}
  @Get()
  getAllLogs() {
    return this.logService.getAllLogs();
  }

}
