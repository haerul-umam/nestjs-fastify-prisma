import { Prisma, PrismaClient } from 'src/generated/prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService
  extends PrismaClient<{
    log: [
      { emit: 'event'; level: 'query' },
      { emit: 'stdout'; level: 'info' },
      { emit: 'stdout'; level: 'warn' },
      { emit: 'stdout'; level: 'error' },
    ];
    errorFormat: 'pretty';
  }>
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'pretty',
    });

    if (process.env.SHOW_PRISMA_QUERIES?.toLowerCase() === 'true') {
      this.$on('query', (e: Prisma.QueryEvent) => {
        console.log(`Query: ${e.query}`);
        console.log(`Params: ${e.params}`);
        console.log(`Duration: ${e.duration}ms\n`);
      });
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
