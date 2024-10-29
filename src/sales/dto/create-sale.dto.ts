import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreatePropertyDto } from 'src/properties/dto/create-property.dto';

export class CreateSaleDto extends CreatePropertyDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  salePrice: number;

  @IsBoolean()
  @IsOptional()
  isNegotiable: boolean;

  @IsString()
  @IsOptional()
  ownershipHistory: string;
}
