import { Test, TestingModule } from '@nestjs/testing';
import { ItemSeriesService } from './item-series.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ItemSeries } from './entities/item-sery.entity';

describe('ItemSeriesService', () => {
  let service: ItemSeriesService;

  const mockRepo = {
    save: jest.fn(),
    findOneByOrFail: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemSeriesService,
        {
          provide: getRepositoryToken(ItemSeries),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ItemSeriesService>(ItemSeriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
