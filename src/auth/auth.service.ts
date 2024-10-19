import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(registerDto: RegisterDto) {
    const hashedPassword = await hash(registerDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: registerDto.username,
        email: registerDto.email,
        password: hashedPassword,
      },
    });
    return {
      message: 'Registration successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: loginDto.username }, { email: loginDto.email }],
      },
    });

    //compare password
    const isPasswordValid = await compare(loginDto.password, user.password);

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    //create jwt token
    const payload = { sub: user.id, username: user.username, role: user.role };
    const token = this.jwtService.sign(payload);

    //save token in cookie
    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() + Number(process.env.COOKIE_EXPIRES_TIME) * 24 * 60 * 60 * 1000,
      ),
    });

    return {
      message: 'Login successful',
      token,
    };
  }
}
