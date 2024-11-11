import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Property,
  PropertyDocument,
} from 'src/properties/schema/property.schema';

export type SaleDocument = PropertyDocument & Sale;

@Schema({ timestamps: true, versionKey: false })
export class Sale extends Property {
  @Prop({ required: true, type: Number })
  salePrice: number;

  @Prop({ type: Boolean, required: false, default: true })
  isNegotiable: boolean;

  @Prop({ required: false, type: String })
  ownershipHistory: string;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);

export const SALEMODEL = Sale.name;
