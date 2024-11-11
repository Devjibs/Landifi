import { IsArray, IsOptional } from 'class-validator';
import { Lease } from 'src/leases/schemas/lease.schema';
import { Sale } from 'src/sales/schemas/sale.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateTenantDto extends CreateUserDto {
  @IsArray()
  @IsOptional()
  leases: Lease[];

  @IsArray()
  @IsOptional()
  purchases: Sale[];
}
