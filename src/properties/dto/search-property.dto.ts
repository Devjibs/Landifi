import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SearchPropertyDto {
  @IsString()
  @IsOptional()
  landloard: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  type: string;
}
