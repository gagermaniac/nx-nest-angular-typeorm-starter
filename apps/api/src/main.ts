/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

import { AllExceptionsFilter } from './app/common/utils/exception-filter.filter';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: true
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionsFilter(
      httpAdapter
    )
  );

  const config = new DocumentBuilder()
    .setTitle('APP API')
    .setDescription('APP API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  //set bearer auth persistent
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  SwaggerModule.setup('docs', app, document, customOptions);

  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/');
  });
}

bootstrap();
