import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { Lease } from 'src/leases/schemas/lease.schema';
import { Property } from 'src/properties/schema/property.schema';
import { Sale } from 'src/sales/schemas/sale.schema';

export class CreateUserDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsDefined()
  email: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must countain 1 uppercase, 1 lowercase, any of '@$!%*?&' and 8 characters",
    },
  )
  password: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(2)
  @MaxLength(30)
  @Matches(/^[A-Za-zÀ-ÿẸỌṢẹọṣ-]+$/, {
    message: 'Enter valid characters',
  })
  firstName: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(2)
  @MaxLength(30)
  @Matches(/^[A-Za-zÀ-ÿẸỌṢẹọṣ-]+$/, {
    message: 'Enter valid characters',
  })
  lastName: string;

  @IsDefined()
  @Transform(({ value }) => value.toLowerCase().trim())
  @IsEnum(Role)
  userType: Role;

  @IsArray()
  @IsOptional()
  properties: Property[];

  @IsArray()
  @IsOptional()
  leases: Lease[];

  @IsArray()
  @IsOptional()
  purchases: Sale[];
}
