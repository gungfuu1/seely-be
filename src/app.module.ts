import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
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
import { ItemSeriesModule } from './item-series/item-series.module';
import { LoginLoggerMiddleware } from './middlewares/login-logger.middleware';

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
    ItemSeriesModule,
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
export class AppModule implements NestModule { // Add implements & config consumer
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginLoggerMiddleware)
      .forRoutes(
        { path: '*auth/login', method: RequestMethod.POST },
        { path: '*keycloak/login', method: RequestMethod.GET }
      );
  }
}
