import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';

import {AppModule} from './app/app.module';
import {ApplicationConfig} from './lib/config/Application.config';
import {DatabaseConfig} from './lib/config/Database.config';
import {initApp} from './lib/init/init-app';
import {runPrismaMigrations} from './lib/util/helpers.util';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const databaseConfig = app.get<DatabaseConfig>(DatabaseConfig);
  const appConfig = app.get<ApplicationConfig>(ApplicationConfig);

  await runPrismaMigrations(databaseConfig.url);

  initApp(app);

  const port = 8000;
  Logger.log(
    `Attempting to listen on :: port ${port} in NODE_ENV: ${appConfig.nodeEnv}...`,
  );
  await app.listen({host: '::', port}, () => {
    Logger.log(
      `Listening on :: port ${port} in NODE_ENV: ${appConfig.nodeEnv}...`,
    );
  });
}
bootstrap().catch((error) => console.error(error));
