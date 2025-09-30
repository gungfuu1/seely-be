import { Module } from '@nestjs/common';
import { ItemSeriesService } from './item-series.service';
import { ItemSeriesController } from './item-series.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemSeries } from './entities/item-sery.entity';
import { AvgrService } from './avgr.service';
import { Average } from './entities/avgr.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemSeries, Average])],
  controllers: [ItemSeriesController],
  providers: [ItemSeriesService, AvgrService],
})
export class ItemSeriesModule {}
