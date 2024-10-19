import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
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
    const data = {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
    console.log(data);
    return data;
  }
}
