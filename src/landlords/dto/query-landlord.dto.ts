import { IsOptional, IsString } from 'class-validator';

export class QueryLandlordDto {
  @IsString()
  @IsOptional()
  page: string;

  @IsString()
  @IsOptional()
  limit: string;
}
