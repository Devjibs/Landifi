import { PickType } from '@nestjs/mapped-types';
import { CreateTenantDto } from './create-tenant.dto';

export class UpdateTenantDto extends PickType(CreateTenantDto, [
  'firstName',
  'lastName',
  'properties',
  'savedProperties',
  'leases',
  'purchases',
]) {}
