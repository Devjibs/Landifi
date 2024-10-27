import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from 'src/common/enums/index.enum';

// export type UserDocument = HydratedDocument<User>;

@Schema({ discriminatorKey: 'userKind', timestamps: true, versionKey: false })
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
    type: String,
    required: true,
    immutable: true,
    enum: Role,
  })
  userType: string;

  @Prop({ default: false })
  isVerified: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

export const USER_MODEL = User.name;

//  Remove sensitive data from response object globally
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};
