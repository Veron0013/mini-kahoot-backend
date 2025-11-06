import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @MinLength(3)
  username!: string;

  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;
}
