import { NodeEnvironmentEnum } from 'src/core/common/enums/node.emum';

export interface IAppEnvironment {
  PORT: number;
  NODE_ENV: NodeEnvironmentEnum;
}
