import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  verificationToken: string;
}
