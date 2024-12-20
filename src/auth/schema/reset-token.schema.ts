import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class ResetToken extends Document {
  @Prop({ required: true })
  OTP: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true, type: mongoose.Types.ObjectId })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  expiryDate: Date;
}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);

export const RESETTOKENMODEL = ResetToken.name;
