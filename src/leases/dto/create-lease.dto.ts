import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
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

  @IsDateString()
  @IsOptional()
  leaseStartDate: string;

  @IsDateString()
  @IsOptional()
  leaseEndDate: string;

  @IsBoolean()
  @IsOptional()
  isFurnished: boolean;
}
