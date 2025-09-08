import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructure.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from '@application/api/http-rest/interceptor/transform.response.interceptor';
import { UserModule } from 'src/modules/user/user.module';
import { AppConfigService } from '@infrastructure/config/app.config';

@Module({
  imports: [InfrastructureModule, UserModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    AppConfigService,
  ],
})
export class RootModule {}
