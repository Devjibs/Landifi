import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { UsersModule } from 'src/users/users.module';
import { LeasesModule } from 'src/leases/leases.module';
import { PropertiesModule } from 'src/properties/properties.module';

@Module({
  imports: [UsersModule, LeasesModule, PropertiesModule],
  controllers: [TenantsController],
  providers: [TenantsService],
})
export class TenantsModule {}
