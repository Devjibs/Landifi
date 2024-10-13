import { Transform } from 'class-transformer';
import { IsDefined, IsEmail } from 'class-validator';

export class RequestionNewVerificationDto {
  @IsEmail()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  @IsDefined()
  email: string;
}
