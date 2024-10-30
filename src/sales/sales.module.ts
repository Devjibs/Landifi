import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { UsersModule } from 'src/users/users.module';
import { PropertiesModule } from 'src/properties/properties.module';

@Module({
  imports: [UsersModule, PropertiesModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
