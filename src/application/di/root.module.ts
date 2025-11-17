import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructure.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppConfigService } from '@infrastructure/config/app.config';
import { UserModule } from './user.module';
import { TransformInterceptor } from '@application/api/http-rest/interceptors/transform.response.interceptor';

@Module({
  imports: [InfrastructureModule, UserModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    AppConfigService,
  ],
})
export class RootModule {}
