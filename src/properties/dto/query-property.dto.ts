import { IsOptional, IsString } from 'class-validator';

export class QueryPropertyDto {
  @IsString()
  @IsOptional()
  page: string;

  @IsString()
  @IsOptional()
  limit: string;
}
