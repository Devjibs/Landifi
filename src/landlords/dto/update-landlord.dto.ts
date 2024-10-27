import { PickType } from '@nestjs/mapped-types';
import { CreateLandlordDto } from './create-landlord.dto';

export class UpdateLandlordDto extends PickType(CreateLandlordDto, [
  'firstName',
  'lastName',
  'properties',
  'purchases',
]) {}
