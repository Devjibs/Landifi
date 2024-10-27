import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SaleDocument = HydratedDocument<Sale>;

@Schema({ timestamps: true, versionKey: false })
export class Sale {}

export const SaleSchema = SchemaFactory.createForClass(Sale);

export const SALEMODEL = Sale.name;
