import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { QuestionsModule } from './questions/questions.module';
import { GameSessionModule } from './gameSession/gameSession.module';
import { GameInstanceModule } from './game-instance/game-instance.module';
import { GameLoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    GameLoggerModule,
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
    GameInstanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
