import { Transform } from 'class-transformer';
import { IsDefined, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  @IsDefined()
  email: string;
}
