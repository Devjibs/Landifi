import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PickType(CreateUserDto, [
  'firstName',
  'lastName',
  'gender',
  'about',
  'phone',
  'age',
  'occupation',
  'address',
  'location',
  'properties',
  'leases',
  'purchases',
]) {}
