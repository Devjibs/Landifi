import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum UserType {
  LANDLORD = 'landlord',
  TENANT = 'tenant',
}

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
    enum: UserType,
  })
  userType: UserType;

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
