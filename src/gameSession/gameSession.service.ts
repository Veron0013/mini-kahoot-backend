import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  GameSession,
  GameSessionDocument,
} from './schemas/game-session.schema';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { QuestionService } from '../questions/questions.service';
import { StartGameSessionDto } from './dto/start-game.dto';
import { FinishGameSessionDto } from './dto/finish-game.dto';

@Injectable()
export class GameSessionService {
  constructor(
    @InjectModel(GameSession.name)
    private gameSessionModel: Model<GameSessionDocument>,
    private readonly questionsService: QuestionService,
  ) {}

  async submitAnswer(gameSessionId: string, dto: SubmitAnswerDto) {
    if (dto.answerIndex == null) {
      throw new BadRequestException('Answer index is required');
    }

    const session = await this.gameSessionModel.findById(gameSessionId);

    if (!session) throw new NotFoundException('Game session not found');

    const question = await this.questionsService.findById(dto.questionId);

    if (!question) throw new NotFoundException('Question not found');

    const isCorrect = question.correctIndex === dto.answerIndex;

    // Визначаємо поточний streak
    const previousAnswer = session.answers[session.answers.length - 1];
    const currentStreak = isCorrect ? (previousAnswer?.streak ?? 0) + 1 : 0;

    // Розрахунок балів з урахуванням streak
    const count: number = this.calculateScore(
      question.bonus,
      isCorrect,
      dto.answerTime,
      currentStreak,
      question.difficulty,
    );

    // Додаємо відповідь в масив answers і апдейтимо totalScore
    session.answers.push({
      questionId: new Types.ObjectId(dto.questionId),
      answerTime: dto.answerTime,
      count,
      isCorrect,
      streak: currentStreak,
    });

    session.totalScore += count;

    await session.save();

    return {
      count,
      isCorrect,
      totalScore: session.totalScore,
      streak: currentStreak,
    };
  }

  private calculateScore(
    questionBonus: number,
    isCorrect: boolean,
    answerTime: number,
    currentStreak: number,
    difficulty: number,
  ): number {
    if (!isCorrect) return 0;
    const correctAnswerBonus = 1 + currentStreak / 100 + difficulty / 10; // можна взяти з налаштувань
    const answerTimeBonus = answerTime * 0.1; // як приклад
    return questionBonus * correctAnswerBonus - answerTimeBonus;
  }

  async findById(gameSessionId: string) {
    const session = await this.gameSessionModel.findById(gameSessionId);
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async createSession(dto: StartGameSessionDto) {
    return this.gameSessionModel.create({
      ...dto,
      startedAt: new Date(),
    });
  }

  async finishSession(dto: FinishGameSessionDto) {
    return this.gameSessionModel.findByIdAndUpdate(
      dto.sessionId,
      { finishedAt: new Date() },
      { new: true, runValidators: true },
    );
  }

  async getAllSessions(userId: string) {
    return this.gameSessionModel.find({ userId });
  }
}
