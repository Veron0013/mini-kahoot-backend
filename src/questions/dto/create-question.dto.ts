import {
  IsString,
  IsNumber,
  IsArray,
  IsObject,
  IsOptional,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TranslationDto {
  @IsString()
  question: string;

  @IsArray()
  options: string[];

  @IsNumber()
  correctIndex: number;

  @IsNumber()
  questionDelay: number;

  @IsNumber()
  answerDelay: number;
}

export class CreateQuestionDto {
  @IsString()
  name: string;

  @IsObject()
  value: { question: string };

  @IsNumber()
  @Min(1)
  @Max(5)
  difficulty: number;

  @IsObject()
  @ValidateNested()
  @Type(() => TranslationDto)
  translations: Record<string, TranslationDto>;

  @IsArray()
  @IsOptional()
  tags?: string[];
}
