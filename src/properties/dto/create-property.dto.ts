import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { PropertyType } from '../schema/property.schema';

export class CreatePropertyDto {
  @IsString()
  @IsEnum(PropertyType)
  type: PropertyType;

  @IsString()
  location: string;

  @IsNumber()
  price: number;

  @IsArray()
  amenities: string[];
}
