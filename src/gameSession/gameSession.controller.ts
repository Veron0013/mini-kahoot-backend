import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { GameSessionService } from './gameSession.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { StartGameSessionDto } from './dto/start-game.dto';

@Controller('api/game-sessions')
export class GameSessionController {
  constructor(private readonly gameSessionService: GameSessionService) {}

  @Post()
  createSession(@Body() dto: StartGameSessionDto) {
    return this.gameSessionService.createSession(dto);
  }

  // POST /api/game-sessions/:sessionId/answers
  @Post(':sessionId/answers')
  submitAnswer(
    @Param('sessionId') sessionId: string,
    @Body() dto: SubmitAnswerDto,
  ) {
    return this.gameSessionService.submitAnswer(sessionId, dto);
  }

  // GET /api/game-sessions/:sessionId
  @Get(':sessionId')
  getOne(@Param('sessionId') sessionId: string) {
    return this.gameSessionService.findById(sessionId);
  }

  @Get()
  getAll(@Query('userId') userId: string) {
    return this.gameSessionService.getAllSessions(userId);
  }
}
