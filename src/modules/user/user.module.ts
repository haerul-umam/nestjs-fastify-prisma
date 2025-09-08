import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { GetUserService } from './services/get-user.service';
import { GetUsersService } from './services/get-users.service';
import { UserRepository } from './repositories/user.repositoriy';
import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';
import { CreateUserService } from './services/create-user.service';

@Module({
  controllers: [UserController],
  providers: [
    GetUserService,
    GetUsersService,
    CreateUserService,
    UserRepository,
  ],
  imports: [PrismaModule],
})
export class UserModule {}
