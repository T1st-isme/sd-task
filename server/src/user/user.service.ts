import { LogActivityService } from './../services/log-activity.service';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ActivityType } from '@prisma/client';
import { hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly logActivityService: LogActivityService,
  ) {}


  async findAll() {
    const users = await this.prisma.user.findMany();
    return {
      success: Boolean(users.length),
      data: users,
    };
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async requestPasswordReset(resetDto: RequestPasswordResetDto, ip: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: resetDto.email },
    });
    if (!user) {
      await this.logActivityService.logActivity(
        null,
        ActivityType.FAILED_LOGIN,
        ip,
        'User not found',
      );
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    //generate token for 1 hour
    const token = this.jwtService.sign(
      { email: user.email },
      { secret: process.env.JWT_PASSWORD_SECRET, expiresIn: '1h' },
    );

    //send email with reset link
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset Your Password',
      template: './resetPassword',
      context: {
        token,
        frontendUrl: process.env.FRONTEND_URL,
      },
    });

    await this.logActivityService.logActivity(
      user.id,
      ActivityType.PASSWORD_RESET,
      ip,
      'Password reset link sent to email',
    );

    return {
      message: 'Password reset link sent to email',
      resetLink: `${process.env.FRONTEND_URL}/user/reset-password?token=${token}`,
    };
  }

  async resetPassword(resetDto: ResetPasswordDto, ip: string, token: string) {
    const resetData = this.jwtService.verify(token, {
      secret: process.env.JWT_PASSWORD_SECRET,
    });

    const user = await this.prisma.user.findFirst({
      where: { email: resetData.email },
    });

    if (!user) {
      await this.logActivityService.logActivity(
        null,
        ActivityType.FAILED_LOGIN,
        ip,
        'Invalid or expired token',
      );
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await hash(resetDto.newPassword, 10);
    await this.prisma.user.update({
      where: { email: user.email },
      data: { password: hashedPassword },
    });

    await this.logActivityService.logActivity(
      user.id,
      ActivityType.PASSWORD_RESET,
      ip,
      'Password reset successful',
    );

    return { message: 'Password reset successful' };
  }
}
