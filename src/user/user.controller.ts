import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post('request-password-reset')
  async requestPasswordReset(
    @Body() resetDto: RequestPasswordResetDto,
    @Req() req: Request,

  ) {
    return this.userService.requestPasswordReset(resetDto, req.ip);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetDto: ResetPasswordDto, @Req() req: Request, @Query('token') token: string) {
    return this.userService.resetPassword(resetDto, req.ip, token);
  }
}
