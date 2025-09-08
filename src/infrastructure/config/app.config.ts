import { IsEnum, IsNumber, IsString } from 'class-validator';
import { NodeEnvironmentEnum } from 'src/core/common/enums/node.emum';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class AppEnvironment {
  @IsEnum(NodeEnvironmentEnum)
  NODE_ENV: NodeEnvironmentEnum;

  @IsNumber()
  PORT: number;

  @IsString()
  SENTRY_DSN: string;
}

@Injectable()
export class AppConfigService implements AppEnvironment {
  public NODE_ENV: NodeEnvironmentEnum;
  public PORT: number;
  public SENTRY_DSN: string;

  constructor(
    private readonly configService: ConfigService<AppEnvironment, true>,
  ) {
    this.NODE_ENV = this.configService.get('NODE_ENV');
    this.PORT = this.configService.get('PORT', 4000);
    this.SENTRY_DSN = this.configService.get('SENTRY_DSN');
  }
}
