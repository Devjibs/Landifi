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
import { PROPERTYMODEL, PropertySchema } from 'src/properties/schema/property.schema';
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
  { name: PROPERTYMODEL, schema: PropertySchema },
];

@Global()
@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  providers: [],
  exports: [MongooseModule.forFeature(MODELS)],
})
export class MongooseSchemasModule {}
