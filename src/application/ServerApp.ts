import helmet from '@fastify/helmet';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { loggerInstance } from '@infrastructure/config/logger.config';
import { RootModule } from './di/root.module';
import { IEnvVariables } from './interfaces/env.interface';

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

    await app.register(helmet);

    app.enableVersioning({ type: VersioningType.URI });
    app.enableCors();

    const configService = app.get(ConfigService<IEnvVariables>);
    const port = configService.get('PORT', 4000, { infer: true });

    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
  }

  public static new(): ServerApplication {
    return new ServerApplication();
  }
}
