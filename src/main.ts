import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {
  const logger = new Logger('Main-Gateway');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: '',
        method: RequestMethod.GET,
      },
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  /**
   * Con .useGlobalFilters es como configuramos de forma global
   * en nuestra aplicación el uso del filtro de excepción
   * personalizados que creamos
   */
  app.useGlobalFilters(new RpcCustomExceptionFilter());

  await app.listen(envs.port);

  logger.log(`Gateway running on port ${envs.port}`);
}

bootstrap();
