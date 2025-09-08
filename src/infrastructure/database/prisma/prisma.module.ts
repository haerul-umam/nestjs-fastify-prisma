import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaTransactionalDatabaseService } from './prisma-trx.service';

@Module({
  providers: [PrismaService, PrismaTransactionalDatabaseService],
  exports: [PrismaService, PrismaTransactionalDatabaseService],
})
export class PrismaModule {}
