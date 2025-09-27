import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RatingModule } from './rating/rating.module';
import { dataSourceOpts } from './data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerScoreModule } from './owner-score/owner-score.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dataSourceOpts,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    RatingModule,
    OwnerScoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
