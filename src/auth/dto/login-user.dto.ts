import { Transform } from 'class-transformer';
import { IsDefined, IsEmail, IsEnum, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsDefined()
  email: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  password: string;
}
