import { Test, TestingModule } from '@nestjs/testing';
import { ItemSeriesController } from './item-series.controller';
import { ItemSeriesService } from './item-series.service';
import { AvgrService } from './avgr.service';

describe('ItemSeriesController', () => {
  let controller: ItemSeriesController;

  const mockItemSeriesService = {
    create: jest.fn(),
    search: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAvgrService = {
    rate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemSeriesController],
      providers: [
        {
          provide: ItemSeriesService,
          useValue: mockItemSeriesService,
        },
        {
          provide: AvgrService,
          useValue: mockAvgrService,
        },
      ],
    }).compile();

    controller = module.get<ItemSeriesController>(ItemSeriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.findOne with id', () => {
    const id = 1;
    controller.findOne({ id });
    expect(mockItemSeriesService.findOne).toHaveBeenCalledWith(id);
  });
});
