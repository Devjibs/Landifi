import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Lease } from 'src/leases/schemas/lease.schema';
import { Sale } from 'src/sales/schemas/sale.schema';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class Tenant extends User {
  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: 'Leases',
  })
  leases: Types.ObjectId[] | Lease[];

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: 'Sale',
  })
  purchases: Types.ObjectId[] | Sale[];
}

export type TenantDocument = Tenant & Document;

export const TenantSchema = SchemaFactory.createForClass(Tenant);

export const TENANT_MODEL = Tenant.name;
