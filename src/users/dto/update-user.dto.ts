import { IsOptional, IsString, IsIn } from 'class-validator';
import { LanguageArray } from '../../common/types/common.types';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsIn(LanguageArray)
  language?: string;

  @IsOptional()
  @IsIn(['light', 'dark'])
  theme?: 'light' | 'dark';

  @IsOptional()
  @IsString()
  avatar?: string;
}
