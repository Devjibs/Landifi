import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreatePropertyDto } from 'src/properties/dto/create-property.dto';

export class CreateLeaseDto extends CreatePropertyDto {
  @IsArray()
  @IsOptional()
  amenities: string[];

  @IsNumber()
  @Transform(({ value }) => Number(value))
  annualRent: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  securityDeposit: number;

  @IsString()
  // @Transform(({ value }) => value.toString())
  @IsOptional()
  leaseStartDate: string;

  @IsString()
  // @Transform(({ value }) => value.toString())
  @IsOptional()
  leaseEndDate: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  isFurnished: boolean;
}
