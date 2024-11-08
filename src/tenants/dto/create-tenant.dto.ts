import { IsArray, IsOptional } from 'class-validator';
import { Lease } from 'src/leases/schemas/lease.schema';
import { Property } from 'src/properties/schema/property.schema';
import { Sale } from 'src/sales/schemas/sale.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateTenantDto extends CreateUserDto {
  @IsArray()
  @IsOptional()
  savedProperties: Property[];

  @IsArray()
  @IsOptional()
  leases: Lease[];

  @IsArray()
  @IsOptional()
  purchases: Sale[];
}
