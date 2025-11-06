import type { Response, Request } from 'express';

import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
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

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: Response): void {
    this.auth.logout(res);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: boolean }> {
    return await this.auth.refresh(req, res);
  }
}
