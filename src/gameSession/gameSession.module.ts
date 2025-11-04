import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameSessionService } from './gameSession.service';
import { GameSessionController } from './gameSession.controller';
import { GameSession, GameSessionSchema } from './schemas/game-session.schema';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameSession.name, schema: GameSessionSchema },
    ]),
    QuestionsModule, //щоб юзати схему питань
  ],
  controllers: [GameSessionController],
  providers: [GameSessionService],
  exports: [GameSessionService],
})
export class GameSessionModule {}
