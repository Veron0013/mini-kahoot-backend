import { IsNotEmpty, IsString } from 'class-validator';

export class FinishGameSessionDto {
  @IsNotEmpty()
  @IsString()
  sessionId: string;
}
