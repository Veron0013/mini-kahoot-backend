import { Controller } from '@nestjs/common';
import { GameInstanceService } from './game-instance.service';

@Controller('game-instance')
export class GameInstanceController {
  constructor(private readonly gameInstanceService: GameInstanceService) {}
}
