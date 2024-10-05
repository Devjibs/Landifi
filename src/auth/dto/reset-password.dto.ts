import { Transform } from 'class-transformer';
import { IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  resetToken: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must countain 1 uppercase, 1 lowercase, any of '@$!%*?&' and 8 characters",
    },
  )
  newPassword: string;
}
