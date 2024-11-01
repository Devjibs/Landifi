import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enums/index.enum';
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
  @Transform(({ value }) => {
    return (
      value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase()
    );
  })
  @MinLength(2)
  @MaxLength(30)
  @Matches(/^[A-Za-zÀ-ÿẸỌṢẹọṣ-]+$/, {
    message: 'Enter valid characters',
  })
  firstName: string;

  @IsString()
  @Transform(({ value }) => {
    return (
      value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase()
    );
  })
  @MinLength(2)
  @MaxLength(30)
  @Matches(/^[A-Za-zÀ-ÿẸỌṢẹọṣ-]+$/, {
    message: 'Enter valid characters',
  })
  lastName: string;

  @IsDefined()
  @Transform(({ value }) => {
    return value.trim().toLowerCase();
  })
  @IsEnum(Role)
  userType: Role;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    return (
      value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase()
    );
  })
  // @Matches(/^[A-Za-zÀ-ÿẸỌṢẹọṣ-]+$/, {
  //   message: 'Enter valid characters',
  // })
  gender: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    return (
      value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase()
    );
  })
  // @Matches(/^[A-Za-zÀ-ÿẸỌṢẹọṣ-]+$/, {
  //   message: 'Enter valid characters',
  // })
  about: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    return (
      value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase()
    );
  })
  // @Matches(/^[A-Za-zÀ-ÿẸỌṢẹọṣ-]+$/, {
  //   message: 'Enter valid characters',
  // })
  phone: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  age: number;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    return (
      value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase()
    );
  })
  // @Matches(/^[A-Za-zÀ-ÿẸỌṢẹọṣ-]+$/, {
  //   message: 'Enter valid characters',
  // })
  occupation: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    return (
      value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase()
    );
  })
  // @Matches(/^[A-Za-zÀ-ÿẸỌṢẹọṣ-]+$/, {
  //   message: 'Enter valid characters',
  // })
  address: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    return (
      value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase()
    );
  })
  // @Matches(/^[A-Za-zÀ-ÿẸỌṢẹọṣ-]+$/, {
  //   message: 'Enter valid characters',
  // })
  location: string;

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
