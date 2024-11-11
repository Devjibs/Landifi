import { PickType } from '@nestjs/mapped-types';
import { CreateTenantDto } from './create-tenant.dto';

export class UpdateLandlordDto extends PickType(CreateTenantDto, [
  'firstName',
  'lastName',
  'properties',
  'leases',
  'purchases',
]) {}
