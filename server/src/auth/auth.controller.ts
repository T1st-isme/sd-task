import { UserService } from 'src/user/user.service';
import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  UnauthorizedException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ActivityType } from '@prisma/client';
import { LogActivityService } from 'src/services/log-activity.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly logActivityService: LogActivityService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    description: 'User registration data',
    type: RegisterDto,
  })
  signup(@Body() registerDto: RegisterDto, @Req() req: Request) {
    return this.authService.signup(registerDto, req.ip);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    description: 'User login data',
    type: LoginDto,
  })
  login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    return this.authService.login(loginDto, res, req.ip);
  }

  @Post('enable-2fa')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable two-factor authentication' })
  @ApiResponse({ status: 200, description: '2FA enabled.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async enableTwoFactorAuthentication(@Req() req) {
    const token = req.cookies['jwt'];
    const user = await this.jwtService.verifyAsync(token);

    const { qrCodeDataURL } =
      await this.authService.generateTwoFactorSecret(user);
    return { qrCodeDataURL };
  }


  
  @Post('verify-2fa')
  @UseGuards(JwtAuthGuard)
  async verifyTwoFactor(@Req() req, @Body('code') code: string) {
    //verify token with jwt
    const token = req.cookies['jwt'];
    const user = await this.jwtService.verifyAsync(token);

    const isValid = await this.authService.verifyTwoFactorCode(
      user,
      code,
      req.ip,
    );

    if (isValid) {
      const updatedUser = await this.userService.updateUser(user.id, {
        twoFactorEnabled: true,
      });
      if (updatedUser) {
        await this.logActivityService.logActivity(
          user.id,
          ActivityType.UPDATE_USER,
          req.ip,
          'Update user to enable 2FA',
        );
      }
       await this.logActivityService.logActivity(
        user.id,
        ActivityType.ENABLE_2FA,
        req.ip,
        '2FA enabled',
      );
      throw new HttpException('2FA enabled', HttpStatus.OK);
    } else {
      throw new UnauthorizedException('Invalid authentication code');
    }
  }


}
