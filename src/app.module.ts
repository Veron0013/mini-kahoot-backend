import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { LoggerModule } from 'nestjs-pino';
import { QuestionsModule } from './questions/questions.module';
import { GameSessionModule } from './gameSession/gameSession.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        autoLogging: true, // можеш увімкнути true, щоб логувало все
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
              ip: req.raw?.socket?.remoteAddress,
            };
          },
          res(res) {
            return {
              statusCode: res?.statusCode,
            };
          },
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    QuestionsModule,
    GameSessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
