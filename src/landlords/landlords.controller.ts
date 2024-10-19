import { Controller } from '@nestjs/common';
import { LandlordsService } from './landlords.service';

@Controller('landlords')
export class LandlordsController {
  constructor(private readonly landlordsService: LandlordsService) {}
}
