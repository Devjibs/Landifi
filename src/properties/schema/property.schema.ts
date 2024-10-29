import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  PropertyCategory,
  PropertyStatus,
  PropertyType,
} from 'src/common/enums/index.enum';
import { ImageType } from 'src/common/types/index.type';

export type PropertyDocument = HydratedDocument<Property>;

@Schema({
  discriminatorKey: 'propertyCategory',
  timestamps: true,
  versionKey: false,
})
export class Property {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, enum: PropertyType })
  type: string;

  @Prop({ required: true, enum: PropertyCategory })
  category: string;

  @Prop({ required: true, enum: PropertyStatus })
  status: string;

  @Prop({ required: true, type: String })
  address: string;

  @Prop({ type: String, required: true })
  location: string;

  @Prop({ required: true })
  images: ImageType[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  landlord: Types.ObjectId;
}

export const PropertySchema = SchemaFactory.createForClass(Property);

export const PROPERTYMODEL = Property.name;
