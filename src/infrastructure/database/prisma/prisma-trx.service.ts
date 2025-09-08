/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { InjectTransaction, Transaction } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaTransactionalDatabaseService {
  private readonly transaction: Transaction<
    TransactionalAdapterPrisma<PrismaService>
  >;

  constructor(
    @InjectTransaction()
    transaction: Transaction<TransactionalAdapterPrisma<PrismaService>>,
  ) {
    this.transaction = transaction;

    // Override semua properties Prisma dengan transaction
    Object.setPrototypeOf(this, transaction);
    Object.assign(this, transaction);
  }
}

export interface PrismaTransactionalDatabaseService
  extends Transaction<TransactionalAdapterPrisma<PrismaService>> {}
