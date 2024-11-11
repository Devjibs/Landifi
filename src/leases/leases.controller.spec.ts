import { Test, TestingModule } from '@nestjs/testing';
import { LeasesController } from './leases.controller';
import { LeasesService } from './leases.service';

describe('LeasesController', () => {
  let controller: LeasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeasesController],
      providers: [LeasesService],
    }).compile();

    controller = module.get<LeasesController>(LeasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
