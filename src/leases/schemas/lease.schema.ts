import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Property,
  PropertyDocument,
} from 'src/properties/schema/property.schema';

export type LeaseDocument = PropertyDocument & Lease;

@Schema({ timestamps: true, versionKey: false })
export class Lease extends Property {
  @Prop({ required: false, type: [String] })
  amenities: string[];

  @Prop({ required: true, type: Number })
  annualRent: number;

  @Prop({ required: false, type: Number })
  securityDeposit: number;

  @Prop({ type: Date, required: false })
  leaseStartDate: Date;

  @Prop({ type: Date, required: false })
  leaseEndDate: Date;

  @Prop({ required: false, type: Boolean, default: false })
  isFurnished: boolean;
}

export const LeaseSchema = SchemaFactory.createForClass(Lease);

export const LEASEMODEL = Lease.name;
