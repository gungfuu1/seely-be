import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RatingModule } from './rating/rating.module';
import { dataSourceOpts } from './data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerScoreModule } from './owner-score/owner-score.module';
import { UsersModule } from './users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from './auth/auth.module';
import { ConfigifyModule } from '@itgorillaz/configify';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dataSourceOpts,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ConfigifyModule.forRootAsync(),
    RatingModule,
    OwnerScoreModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
    provide: APP_PIPE,
    useClass: ZodValidationPipe,
    },
    AppService,
  ],
})
export class AppModule {}
