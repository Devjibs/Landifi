import { Test, TestingModule } from '@nestjs/testing';
import { LandlordsController } from './landlords.controller';
import { LandlordsService } from './landlords.service';

describe('LandlordsController', () => {
  let controller: LandlordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LandlordsController],
      providers: [LandlordsService],
    }).compile();

    controller = module.get<LandlordsController>(LandlordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
