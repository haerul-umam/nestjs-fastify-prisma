import { IsEnum, IsNumber, IsString } from 'class-validator';
import { IAppEnvironment } from '@application/interfaces/app.env.interface';
import { NodeEnvironmentEnum } from 'src/core/common/enums/node.emum';

export class AppEnvironment implements IAppEnvironment {
  @IsEnum(NodeEnvironmentEnum)
  NODE_ENV: NodeEnvironmentEnum;

  @IsNumber()
  PORT: number;

  @IsString()
  SENTRY_DSN: string;
}
