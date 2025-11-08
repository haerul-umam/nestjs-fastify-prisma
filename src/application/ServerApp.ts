import helmet from '@fastify/helmet';
import compression from '@fastify/compress';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { loggerInstance } from '@infrastructure/config/logger.config';
import { RootModule } from './di/root.module';
import { AppConfigService } from '@infrastructure/config/app.config';

export class ServerApplication {
  public async run(): Promise<void> {
    const app = await NestFactory.create<NestFastifyApplication>(
      RootModule,
      new FastifyAdapter(),
      {
        logger: WinstonModule.createLogger({ instance: loggerInstance }),
      },
    );

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        stopAtFirstError: true,
        forbidNonWhitelisted: true,
      }),
    );

    await Promise.all([
      app.register(helmet),
      app.register(compression, { encodings: ['gzip', 'deflate'] }),
    ]);

    app.enableVersioning({ type: VersioningType.URI });
    app.enableCors();

    const { PORT } = app.get(AppConfigService);
    await app.listen(PORT, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
  }

  public static new(): ServerApplication {
    return new ServerApplication();
  }
}
