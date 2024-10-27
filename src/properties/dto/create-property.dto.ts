import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PropertyType } from 'src/common/enums/index.enum';

export class CreatePropertyDto {
  // @IsString()
  // @Transform(({ value }) => value.trim())
  // title: string;

  // @IsString()
  // @Transform(({ value }) => value.trim())
  // description: string;

  @IsString()
  @IsEnum(PropertyType)
  type: PropertyType;

  @IsString()
  @Transform(({ value }) => value.trim())
  location: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  price: number;

  @IsArray()
  amenities: string[];
}
