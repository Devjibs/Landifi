import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SearchPropertyDto {
  @IsString()
  @IsOptional()
  landloard: string;

  @IsEmail()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  type: string;
}
