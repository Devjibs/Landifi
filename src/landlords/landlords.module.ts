import { Module } from '@nestjs/common';
import { LandlordsService } from './landlords.service';
import { LandlordsController } from './landlords.controller';
import { UsersModule } from 'src/users/users.module';
import { PropertiesModule } from 'src/properties/properties.module';

@Module({
  imports: [UsersModule, PropertiesModule],
  controllers: [LandlordsController],
  providers: [LandlordsService],
  exports: [LandlordsService],
})
export class LandlordsModule {}
