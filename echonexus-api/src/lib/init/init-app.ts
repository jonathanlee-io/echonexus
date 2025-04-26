import {
  HttpStatus,
  INestApplication,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

import {LoggingInterceptor} from '../util/interceptors/logging/logging.interceptor';

export const initApp = (app: INestApplication) => {
  // app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}));

  app.enableCors({
    origin:
      /http:\/\/localhost:4200|http:\/\/(.*).echonexus-local.io:4200|https:\/\/(.*).echonexus.io/,
    allowedHeaders: [
      'Accept',
      'Content-Type',
      'Referer',
      'User-Agent',
      'Authorization',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    preflightContinue: true,
    credentials: true,
    optionsSuccessStatus: HttpStatus.OK,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
    }),
  );

  const loggingInterceptorLogger = new Logger(LoggingInterceptor.name);
  app.useGlobalInterceptors(new LoggingInterceptor(loggingInterceptorLogger));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('echonexus')
    .setDescription('echonexus API')
    .setVersion('0.0.1')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  });
};
