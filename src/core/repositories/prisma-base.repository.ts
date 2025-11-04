import {
  PaginatedResult,
  PaginationMeta,
  PaginationOptions,
} from '@core/common/interfaces/pagination.interface';

type PrismaDelegate = {
  findMany(args?: any): Promise<any[]>;
  count(args?: any): Promise<number>;
};

type PrismaFindManyArgs<T extends { findMany: (...args: any) => any }> =
  NonNullable<Parameters<T['findMany']>[0]>;

type PrismaFindManyResult<T extends { findMany: (...args: any) => any }> =
  Awaited<ReturnType<T['findMany']>>[number];

export abstract class PrismaBaseRepository {
  /**
   * Generic pagination helper
   * @param delegate - Prisma delegate (e.g., prisma.user)
   * @param options - Pagination options (page, limit)
   * @param findOptions - Prisma findMany options (where, orderBy, include, etc.)
   */
  protected async paginate<TDelegate extends PrismaDelegate>(
    delegate: TDelegate,
    options: PaginationOptions,
    findOptions?: Omit<PrismaFindManyArgs<TDelegate>, 'skip' | 'take'>,
  ): Promise<PaginatedResult<PrismaFindManyResult<TDelegate>>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      delegate.findMany({
        ...findOptions,
        skip,
        take: limit,
      }) as unknown as PrismaFindManyResult<TDelegate>[],
      delegate.count({
        where: findOptions?.where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Create pagination metadata manually (for custom queries)
   */
  protected createPaginationMeta(
    page: number,
    limit: number,
    total: number,
  ): PaginationMeta {
    const totalPages = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
}
