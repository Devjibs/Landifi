import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { PropertyType } from 'src/common/enums/index.enum';
import { ImageType } from 'src/common/types/index.type';

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
    required: false,
  })
  images: ImageType[];

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  owner: Types.ObjectId;
}

export const PropertySchema = SchemaFactory.createForClass(Property);

export const PROPERTYMODEL = Property.name;
