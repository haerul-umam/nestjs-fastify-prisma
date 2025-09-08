import { PrismaTransactionalDatabaseService } from '@infrastructure/database/prisma/prisma-trx.service';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.domain';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly db: PrismaTransactionalDatabaseService) {}

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
    const users = await this.db.user.findMany();
    return users.map((user) => new User(user.email, user.name, user.id));
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
