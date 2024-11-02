import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { UsersModule } from 'src/users/users.module';
import { LeasesModule } from 'src/leases/leases.module';

@Module({
  imports: [UsersModule, LeasesModule],
  controllers: [TenantsController],
  providers: [TenantsService],
})
export class TenantsModule {}
