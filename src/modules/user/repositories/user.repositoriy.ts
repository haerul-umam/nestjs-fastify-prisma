import { PrismaTransactionalDatabaseService } from '@infrastructure/database/prisma/prisma-trx.service';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.domain';
import { UserEntity } from '../entities/user.entity';
import { PrismaBaseRepository } from '@core/repositories/prisma-base.repository';
import { UniqueUserFieldDto } from '../dto/create-user.dto';

@Injectable()
export class UserRepository extends PrismaBaseRepository {
  constructor(private readonly db: PrismaTransactionalDatabaseService) {
    super();
  }

  async getById(id: UserEntity['id']) {
    const user = await this.db.user.findUnique({
      where: { id },
    });
    return user ? new User(user) : null;
  }

  async getByUniqueField(field: UniqueUserFieldDto) {
    const user = await this.db.user.findFirst({
      where: {
        OR: Object.keys(field).map((key) => ({
          [key]: field[key as keyof typeof field],
        })),
      },
    });
    return user ? new User(user) : null;
  }

  async getAll() {
    const { data, meta } = await this.paginate(this.db.user, {
      page: 1,
      limit: 10,
    });

    return {
      users: data.map((user) => new User(user)),
      meta,
    };
  }

  async create(data: User) {
    const createdUser = await this.db.user.create({
      data: {
        email: data.email,
        name: data.name,
        username: data.username,
        password_hash: data.password_hash,
        is_active: data.is_active,
      },
    });
    return new User(createdUser);
  }
}
