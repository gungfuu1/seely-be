import { Test, TestingModule } from '@nestjs/testing';
import { ItemSeriesController } from './item-series.controller';
import { ItemSeriesService } from './item-series.service';

describe('ItemSeriesController', () => {
  let controller: ItemSeriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemSeriesController],
      providers: [ItemSeriesService],
    }).compile();

    controller = module.get<ItemSeriesController>(ItemSeriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
