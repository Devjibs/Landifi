import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';
import { Lease } from 'src/leases/schemas/lease.schema';
import { Property } from 'src/properties/schema/property.schema';
import { Sale } from 'src/sales/schemas/sale.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
    minlength: 8,
  })
  password?: string;

  @Prop({
    required: true,
    type: String,
  })
  firstName: string;

  @Prop({
    required: true,
    type: String,
  })
  lastName: string;

  @Prop({
    required: true,
    enum: Role,
  })
  userType: Role;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Property',
  })
  properties: Property;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Lease',
  })
  leases: Lease;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Sale',
  })
  purchases: Sale;

  @Prop({ default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

//  Remove sensitive data from response object globally
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};
