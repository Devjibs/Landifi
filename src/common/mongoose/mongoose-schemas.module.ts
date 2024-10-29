import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  REFRESHTOKENMODEL,
  RefreshTokenSchema,
} from 'src/auth/schema/referesh-token.schema';
import {
  RESETTOKENMODEL,
  ResetTokenSchema,
} from 'src/auth/schema/reset-token.schema';
import {
  EMAILVERIFICATIONTOKENMODEL,
  EmailVerificationTokenSchema,
} from 'src/auth/schema/verification-token.schema';
import {
  LANDLORD_MODEL,
  LandlordSchema,
} from 'src/landlords/schemas/landlord.schema';
import { LEASEMODEL, LeaseSchema } from 'src/leases/schemas/lease.schema';
import {
  PROPERTYMODEL,
  PropertySchema,
} from 'src/properties/schema/property.schema';
import { SALEMODEL, SaleSchema } from 'src/sales/schemas/sale.schema';
import { USER_MODEL, UserSchema } from 'src/users/schemas/user.schema';

const MODELS = [
  {
    name: USER_MODEL,
    schema: UserSchema,
    discriminators: [{ name: LANDLORD_MODEL, schema: LandlordSchema }],
  },
  { name: REFRESHTOKENMODEL, schema: RefreshTokenSchema },
  { name: RESETTOKENMODEL, schema: ResetTokenSchema },
  {
    name: EMAILVERIFICATIONTOKENMODEL,
    schema: EmailVerificationTokenSchema,
  },
  {
    name: PROPERTYMODEL,
    schema: PropertySchema,
    discriminators: [
      { name: SALEMODEL, schema: SaleSchema },
      { name: LEASEMODEL, schema: LeaseSchema },
    ],
  },
];

@Global()
@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  exports: [MongooseModule.forFeature(MODELS)],
})
export class MongooseSchemasModule {}
