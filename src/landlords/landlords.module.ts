import { Module } from '@nestjs/common';
import { LandlordsService } from './landlords.service';
import { LandlordsController } from './landlords.controller';

@Module({
  controllers: [LandlordsController],
  providers: [LandlordsService],
})
export class LandlordsModule {}
