import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { updateGlobalConfig } from 'nestjs-paginate';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppExceptionFilter } from './app-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.use(cookieParser());

  //nestjs-paginate
  updateGlobalConfig({
    defaultLimit: 10,
  });

// Swagger init config
  const config = new DocumentBuilder()
    .setTitle('Seely API')
    .setDescription('The Seely API: Best Series for you')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'accessToken',
    )
    .addSecurityRequirements('accessToken')
    .build();
    
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  // Swagger setup
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // add app-excpetion.filter
  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new AppExceptionFilter(httpAdapter))

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();