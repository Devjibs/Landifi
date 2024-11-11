import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Property } from 'src/properties/schema/property.schema';
import { Sale } from 'src/sales/schemas/sale.schema';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

// export type LandlordDocument = HydratedDocument<Landlord>;

@Schema()
export class Landlord extends User {
  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: 'Property',
  })
  properties: Types.ObjectId[] | Property[];

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: 'Sale',
  })
  purchases: Types.ObjectId[] | Sale[];
}

export type LandlordDocument = Landlord & Document;

export const LandlordSchema = SchemaFactory.createForClass(Landlord);

export const LANDLORD_MODEL = Landlord.name;
