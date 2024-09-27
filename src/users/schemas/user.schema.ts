import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum UserType {
  LANDLORD = 'landlord',
  TENANT = 'tenant',
}

export type UserDocument = HydratedDocument<User>;

@Schema()
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

  @Prop({
    default: Date.now,
    type: Date,
  })
  createdAt: Date;

  @Prop({
    default: Date.now,
    type: Date,
  })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
