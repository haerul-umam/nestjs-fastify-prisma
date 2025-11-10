import helmet from '@fastify/helmet';
import compression from '@fastify/compress';
import multipart from '@fastify/multipart';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  UnprocessableEntityException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
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
        exceptionFactory: (errors) => {
          const result = errors.map((err) => ({
            field: err.property,
            message: err.constraints
              ? err.constraints[Object.keys(err.constraints)[0]]
              : 'No constraints available',
          }));
          return new UnprocessableEntityException(result);
        },
      }),
    );

    await Promise.all([
      app.register(helmet),
      app.register(compression, { encodings: ['gzip', 'deflate'] }),
      app.register(multipart, {
        limits: {
          fileSize: 10 * 1024 * 1024,
          fieldSize: 5 * 1024 * 1024,
          files: 10,
        },
      }),
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
