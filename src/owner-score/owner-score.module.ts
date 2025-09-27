import { Module } from '@nestjs/common';
import { OwnerScoreService } from './owner-score.service';
import { OwnerScoreController } from './owner-score.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerScore } from './entities/owner-score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OwnerScore])],
  controllers: [OwnerScoreController],
  providers: [OwnerScoreService],
})
export class OwnerScoreModule {}
