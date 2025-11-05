import type { Response, Request } from 'express';

import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import type { JwtPayload } from './types';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Req() req: Request & { user: JwtPayload },
    @Res({ passthrough: true }) res: Response,
    @Body() _dto: LoginDto, // щоб не сварився на непроінжектований body
  ) {
    return this.auth.login(req.user, res);
  }
}
