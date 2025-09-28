import { Module } from '@nestjs/common';
import { ItemSeriesService } from './item-series.service';
import { ItemSeriesController } from './item-series.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemSeries } from './entities/item-sery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemSeries])],
  controllers: [ItemSeriesController],
  providers: [ItemSeriesService],
})
export class ItemSeriesModule {}
