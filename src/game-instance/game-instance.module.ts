import { Module } from '@nestjs/common';
import { GameInstanceService } from './game-instance.service';
import { GameInstanceController } from './game-instance.controller';

@Module({
  controllers: [GameInstanceController],
  providers: [GameInstanceService],
})
export class GameInstanceModule {}
