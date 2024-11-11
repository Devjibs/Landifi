import { Test, TestingModule } from '@nestjs/testing';
import { LandlordsService } from './landlords.service';

describe('LandlordsService', () => {
  let service: LandlordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LandlordsService],
    }).compile();

    service = module.get<LandlordsService>(LandlordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
