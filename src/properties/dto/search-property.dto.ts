import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PropertyCategory, PropertyType } from 'src/common/enums/index.enum';

export class SearchPropertyDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(PropertyType)
  @IsOptional()
  type?: PropertyType;

  @IsString()
  @IsOptional()
  category?: PropertyCategory;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @IsOptional()
  maxPrice?: number;
}
