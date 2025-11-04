import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  IsArray,
  IsString,
  IsEnum,
} from 'class-validator';
import { LanguageEnum } from '../../common/types/common.types';

export class GetQuestionsDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  difficulty?: number;

  @Transform(({ value }: { value: string | string[] }) => {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    }
    return Array.isArray(value) ? value.map((t) => String(t).trim()) : [];
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit?: number;

  @IsOptional()
  @IsEnum(LanguageEnum)
  lang?: LanguageEnum; // 'uk' | 'en' | 'pl' | 'de' | ...
}
