import { IsNotEmpty, IsString } from 'class-validator';

export class StartGameSessionDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
