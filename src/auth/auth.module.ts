// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  providers: [AuthService, LocalStrategy, JwtAccessStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
