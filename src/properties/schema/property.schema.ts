import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export enum PropertyType {
  RENT = 'rent',
  SALE = 'sale',
}

export type PropertyDocument = HydratedDocument<Property>;

@Schema({ timestamps: true, versionKey: false })
export class Property {
  @Prop({
    required: true,
    enum: PropertyType,
  })
  type: PropertyType;

  @Prop({
    required: true,
  })
  location: string;

  @Prop({
    required: true,
  })
  price: number;

  @Prop({
    required: true,
  })
  amenities: string[];

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  owner: Types.ObjectId;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
