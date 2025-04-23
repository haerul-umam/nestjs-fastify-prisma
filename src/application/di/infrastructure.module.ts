import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { ClsModule } from 'nestjs-cls';
import { validateAllConfigurations } from 'src/core/common/utils/class-validator/env.validation';
import { AppEnvironment } from 'src/infrastructure/config/app.config';
import { PrismaModule } from 'src/infrastructure/database/prisma/prisma.module';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: (config) =>
        validateAllConfigurations(config, { app: AppEnvironment }),
    }),
    SentryModule.forRoot(),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule],
          // https://papooch.github.io/nestjs-cls/plugins/available-plugins/transactional/prisma-adapter
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
          }),
        }),
      ],
      global: true,
      middleware: { mount: true },
    }),
  ],
  providers: [{ provide: APP_FILTER, useClass: SentryGlobalFilter }],
})
export class InfrastructureModule {}
