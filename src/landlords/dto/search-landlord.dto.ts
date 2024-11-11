import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SearchLandlordDto {
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
