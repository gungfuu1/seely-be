import { Test, TestingModule } from '@nestjs/testing';
import { ItemSeriesService } from './item-series.service';

describe('ItemSeriesService', () => {
  let service: ItemSeriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemSeriesService],
    }).compile();

    service = module.get<ItemSeriesService>(ItemSeriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
