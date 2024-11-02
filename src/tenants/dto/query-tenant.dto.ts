import { IsOptional, IsString } from 'class-validator';

export class QueryTenantdDto {
  @IsString()
  @IsOptional()
  page: string;

  @IsString()
  @IsOptional()
  limit: string;
}
