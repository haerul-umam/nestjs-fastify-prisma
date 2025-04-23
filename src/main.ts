import 'module-alias/register';

import './instrument';
import { ServerApplication } from '@application/ServerApp';

async function bootstrap() {
  const serverApplication = ServerApplication.new();
  await serverApplication.run();
}
void bootstrap();
