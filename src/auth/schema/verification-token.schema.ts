import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class EmailVerificationToken extends Document {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true, type: mongoose.Types.ObjectId })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  expiryDate: Date;
}

export const EmailVerificationTokenSchema = SchemaFactory.createForClass(
  EmailVerificationToken,
);
