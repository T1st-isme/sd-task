import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ActivityType } from '@prisma/client';
import { LogActivityService } from 'src/services/log-activity.service';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly logActivityService: LogActivityService,
  ) {}

  async signup(registerDto: RegisterDto, ip: string) {
    //check if user already exists
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: registerDto.email,
      },
    });

    if (userExists) {
      await this.logActivityService.logActivity(
        null,
        ActivityType.FAILED_REGISTER,
        ip,
        'User already exists',
      );
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    //hash password and create user with hashed password
    const hashedPassword = await hash(registerDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: registerDto.username,
        email: registerDto.email,
        password: hashedPassword,
      },
    });

    //assign role to new user when user signup
    const userRole = await this.prisma.role.findUnique({
      where: { name: 'user' },
    });
    if (userRole) {
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: userRole.id,
        },
      });
    }

    await this.logActivityService.logActivity(
      user.id,
      ActivityType.REGISTER,
      ip,
      'Registration successful',
    );

    return {
      message: 'Registration successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async login(loginDto: LoginDto, res: Response, ip: string) {
    //can login with username or email
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: loginDto.username }, { email: loginDto.email }],
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
    if (!user) {
      await this.logActivityService.logActivity(
        null,
        ActivityType.FAILED_LOGIN,
        ip,
        'Invalid credentials',
      );
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      if (!loginDto.twoFactorCode)
        throw new UnauthorizedException('2FA code required');
      const isTwoFactorValid = await this.verifyTwoFactorCode(
        user,
        loginDto.twoFactorCode,
        ip,
      );
      console.log(isTwoFactorValid);
      if (!isTwoFactorValid)
        throw new UnauthorizedException('Invalid 2FA code');
    }

    //compare password
    const isPasswordValid = await compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      await this.logActivityService.logActivity(
        user.id,
        ActivityType.FAILED_LOGIN,
        ip,
        'Invalid old password during password change',
      );
      throw new HttpException('Invalid old password', HttpStatus.UNAUTHORIZED);
    }

    await this.logActivityService.logActivity(
      user.id,
      ActivityType.LOGIN,
      ip,
      'Login successful',
    );

    //create jwt token
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      twoFactorEnabled: user.twoFactorEnabled,
      roles: user.userRoles.map((x) => x.role.name),
    };
    const token = this.jwtService.sign(payload);

    //save token in cookie
    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() +
          Number(process.env.COOKIE_EXPIRES_TIME) * 24 * 60 * 60 * 1000,
      ),
    });

    return {
      message: 'Login successful',
      token,
    };
  }

  async generateTwoFactorSecret(user: any) {
    if (user.twoFactorEnabled) {
      throw new Error('2FA is already enabled for this user');
    }
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, 'sd-task', secret);

    // Store the secret in the database
    await this.prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret },
    });

    const qrCodeDataURL = await toDataURL(otpauthUrl);
    return { secret, qrCodeDataURL };
  }

  async verifyTwoFactorCode(user: any, code: string, ip: string): Promise<boolean> {
    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (isValid) {
      await this.logActivityService.logActivity(
        user.id,
        ActivityType.SUCCESS_2FA_VERIFICATION,
        ip,
        '2FA verification successful',
      );
    } else {
      await this.logActivityService.logActivity(
        user.id,
        ActivityType.FAILED_2FA_VERIFICATION,
        ip,
        '2FA verification failed',
      );
    }
    return isValid;
  }
}
