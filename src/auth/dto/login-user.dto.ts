import { Transform } from 'class-transformer';
import { IsDefined, IsEmail, IsEnum, IsString } from 'class-validator';
import { UserType } from 'src/users/schemas/user.schema';

export class LoginUserDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsDefined()
  email: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  password: string;

  // @IsDefined()
  // @Transform(({ value }) => value.toLowerCase().trim())
  // @IsEnum(UserType)
  // userType: UserType;
}
