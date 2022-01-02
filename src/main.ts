import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  SwaggerModule.setup(
    configService.get('API_DOCUMENTATION_ROUTE'),
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(configService.get('APP_NAME'))
        .setDescription('Built by Gowtham Reilly')
        .setVersion('1.0')
        .build(),
    ),
  );

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.use(helmet());

  await app.listen(configService.get('PORT'));
}
bootstrap();
