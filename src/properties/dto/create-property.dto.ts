import { IsArray, IsMongoId, IsNumber, IsString } from 'class-validator';
import { PropertyType } from '../schema/property.schema';

export class CreatePropertyDto {
  @IsString()
  type: PropertyType;

  @IsString()
  location: string;

  @IsNumber()
  price: number;

  @IsArray()
  amenities: string[];

  // @IsString()
  // @IsMongoId()
  // owner: string;
}
