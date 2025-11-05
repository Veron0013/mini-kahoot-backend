import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload, PublicUser } from './types';
import { Types } from 'mongoose';
import type { StringValue } from 'ms';

const ACCESS_EXPIRES: StringValue = (process.env.JWT_ACCESS_EXPIRES ??
  '15m') as StringValue;
const REFRESH_EXPIRES: StringValue = (process.env.JWT_REFRESH_EXPIRES ??
  '30d') as StringValue;

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<PublicUser> {
    const created = await this.users.create(dto); // UsersService сам хешує пароль
    const id =
      created._id instanceof Types.ObjectId
        ? created._id.toHexString()
        : String(created._id);
    return { id, email: created.email, username: created.username };
  }

  async validateUser(email: string, password: string): Promise<JwtPayload> {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const sub =
      user._id instanceof Types.ObjectId
        ? user._id.toHexString()
        : String(user._id);
    return { sub, email: user.email, username: user.username };
  }

  private async signTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET as string,
        expiresIn: ACCESS_EXPIRES, // ⬅️ тепер тип ок
      }),
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET as string,
        expiresIn: REFRESH_EXPIRES,
      }),
    ]);
    return { accessToken, refreshToken };
  }
  setAuthCookies(
    res: any,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const secure = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      maxAge: this.toMs(ACCESS_EXPIRES),
      path: '/',
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      maxAge: this.toMs(REFRESH_EXPIRES),
      path: '/',
    });
  }

  private toMs(s: string): number {
    const m = /^(\d+)([smhd])$/i.exec(s);
    if (!m) return 0;
    const n = Number(m[1]);
    const unit = m[2].toLowerCase();
    const mult =
      unit === 's' ? 1e3 : unit === 'm' ? 6e4 : unit === 'h' ? 36e5 : 864e5;
    return n * mult;
  }

  async login(payload: JwtPayload, res: any) {
    const tokens = await this.signTokens(payload);
    this.setAuthCookies(res, tokens);
    return {
      ok: true,
      user: {
        id: payload.sub,
        email: payload.email,
        username: payload.username,
      },
    };
  }
}
