import { Module } from '@nestjs/common';
import { ItemSeriesService } from './item-series.service';
import { ItemSeriesController } from './item-series.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemSeries } from './entities/item-sery.entity';

import { Average } from '../averages/entities/average.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemSeries, Average])],
  controllers: [ItemSeriesController],
  providers: [ItemSeriesService,  Average],
})
export class ItemSeriesModule {}
