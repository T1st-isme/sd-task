import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ActivityType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(registerDto: RegisterDto, ip: string) {
    //check if user already exists
    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: registerDto.username }, { email: registerDto.email }],
      },
    });

    if (userExists) {
      await this.logActivity(
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

    await this.logActivity(user.id, ActivityType.REGISTER, ip, 'Registration successful');

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
      await this.logActivity(
        null,
        ActivityType.FAILED_LOGIN,
        ip,
        'Invalid credentials',
      );
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    //compare password
    const isPasswordValid = await compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      await this.logActivity(
        user.id,
        ActivityType.FAILED_LOGIN,
        ip,
        'Invalid old password during password change',
      );
      throw new HttpException('Invalid old password', HttpStatus.UNAUTHORIZED);
    }

    await this.logActivity(user.id, ActivityType.LOGIN, ip, 'Login successful');

    //create jwt token
    const payload = {
      sub: user.id,
      username: user.username,
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

  private async logActivity(
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
