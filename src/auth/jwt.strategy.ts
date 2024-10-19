import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const tokenFromCookie = request?.cookies?.jwt;
          const tokenFromHeader =
            request?.headers?.authorization?.split(' ')[1];
          return tokenFromCookie || tokenFromHeader || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    console.log('JWT Payload:', payload);
    const { email } = payload;
    const user = await this.userService.findByEmail(email);
    console.log('User:', user);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
