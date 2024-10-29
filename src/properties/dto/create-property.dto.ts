import { IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  PropertyCategory,
  PropertyStatus,
  PropertyType,
} from 'src/common/enums/index.enum';

export class CreatePropertyDto {
  @IsString()
  @Transform(({ value }) => {
    value[0].toUpperCase() + value.slice(1);
    value.trim();
  })
  title: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  description: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsEnum(PropertyType)
  type: PropertyType;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsEnum(PropertyCategory)
  category: PropertyCategory;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsEnum(PropertyStatus)
  status: PropertyStatus;

  @IsString()
  @Transform(({ value }) => value.trim())
  address: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  location: string;
}
