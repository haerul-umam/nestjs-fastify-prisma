import { PrismaTransactionalDatabaseService } from '@infrastructure/database/prisma/prisma-trx.service';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.domain';
import { UserEntity } from '../entities/user.entity';
import { PrismaBaseRepository } from '@core/repositories/prisma-base.repository';

@Injectable()
export class UserRepository extends PrismaBaseRepository {
  constructor(private readonly db: PrismaTransactionalDatabaseService) {
    super();
  }

  async getById(id: UserEntity['id']) {
    const user = await this.db.user.findUnique({
      where: { id },
    });
    return user ? new User(user.email, user.name, user.id) : null;
  }

  async getByEmail(email: string) {
    const user = await this.db.user.findUnique({
      where: { email },
    });
    return user ? new User(user.email, user.name, user.id) : null;
  }

  async getAll() {
    const { data, meta } = await this.paginate(this.db.user, {
      page: 1,
      limit: 10,
    });

    return {
      users: data.map((user) => new User(user.email, user.name, user.id)),
      meta,
    };
  }

  async create(user: User) {
    const createdUser = await this.db.user.create({
      data: {
        email: user.email,
        name: user.name,
      },
    });
    return new User(createdUser.email, createdUser.name, createdUser.id);
  }
}
