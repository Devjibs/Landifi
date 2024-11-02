import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SearchTenantDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  usertype: string;
}
