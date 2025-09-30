import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AvgrDto } from './dto/avgr.dto';
import { ItemSeries } from './entities/item-sery.entity';
import { Average } from './entities/avgr.entity';

@Injectable()
export class AvgrService {
  constructor(private dataSource: DataSource) {}

  async rate(
    itemSeriesId: number,
    avgrDto: AvgrDto,
    loggedInDto: LoggedInDto,
  ) {
    // create transaction
    return this.dataSource.transaction(async (entityManager) => {
      const avgrRepository = entityManager.getRepository(Average);
      const itemSeriesRepository = entityManager.getRepository(ItemSeries);

      // upsert rating
      const keys = {
        itemSeries: { id: itemSeriesId },
        user: { username: loggedInDto.username },
      };

      await avgrRepository
        .upsert(
          { score: avgrDto.score, ...keys },
          { conflictPaths: ['itemSeries', 'user'] },
        )
        .catch(() => {
          throw new NotFoundException(`Not found: id=${itemSeriesId}`);
        });

      // query last avg & count
      const { avg, count } = await avgrRepository
        .createQueryBuilder('avgr')
        .select('AVG(avgr.score)', 'avg')
        .addSelect('COUNT(avgr.id)', 'count')
        .where('avgr.itemSeries = :itemSeriesId', { itemSeriesId })
        .getRawOne();

      // update ItemSeries
      await itemSeriesRepository.update(itemSeriesId, {
        avg_rating: parseFloat(avg) || 0,
        rating_count: parseInt(count, 10) || 0,
      });

      return itemSeriesRepository.findOneBy({ id: itemSeriesId });
    });
  }
}
