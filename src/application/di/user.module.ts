import { Module } from '@nestjs/common';
import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';
import { CreateUserService } from 'src/modules/user/services/create-user.service';
import { UserController } from 'src/modules/user/controllers/user.controller';
import { GetUserService } from 'src/modules/user/services/get-user.service';
import { GetUsersService } from 'src/modules/user/services/get-users.service';
import { UserRepository } from 'src/modules/user/repositories/user.repositoriy';

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
