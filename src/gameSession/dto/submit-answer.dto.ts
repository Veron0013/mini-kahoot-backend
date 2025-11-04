import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SubmitAnswerDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  questionId: string;

  @IsNotEmpty()
  @IsNumber()
  answerTime: number; // час, який юзер витратив

  @IsNotEmpty()
  @IsNumber()
  answerIndex: number; // який варіант обрав
}
