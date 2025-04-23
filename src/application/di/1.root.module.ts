import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructure.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from '@application/api/http-rest/interceptor/transform.response.interceptor';

@Module({
  imports: [InfrastructureModule],
  providers: [{ provide: APP_INTERCEPTOR, useClass: TransformInterceptor }],
})
export class RootModule {}
