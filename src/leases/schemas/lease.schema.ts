import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LeaseDocument = HydratedDocument<Lease>;

@Schema({ timestamps: true, versionKey: false })
export class Lease {}

export const LeaseSchema = SchemaFactory.createForClass(Lease);

export const LEASEMODEL = Lease.name;
