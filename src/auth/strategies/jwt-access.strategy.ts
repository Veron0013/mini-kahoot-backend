// src/auth/strategies/jwt-access.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import type { JwtPayload } from '../types';

// ✅ чітко типізуємо cookies, без any
type CookieReq = Request & { cookies?: Record<string, unknown> };

function cookieExtractor(req: CookieReq): string | null {
  const token = req.cookies?.accessToken;
  return typeof token === 'string' ? token : null;
}
@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return payload; // { sub, email, username }
  }
}
