import { IsOptional, IsString } from 'class-validator';

export class QueryUserDto {
  @IsString()
  @IsOptional()
  page: string;

  @IsString()
  @IsOptional()
  limit: string;
}
