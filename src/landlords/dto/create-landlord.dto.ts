import { IsArray, IsOptional } from 'class-validator';
import { Property } from 'src/properties/schema/property.schema';
import { Sale } from 'src/sales/schemas/sale.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateLandlordDto extends CreateUserDto {
  @IsArray()
  @IsOptional()
  properties: Property[];

  @IsArray()
  @IsOptional()
  purchases: Sale[];
}
