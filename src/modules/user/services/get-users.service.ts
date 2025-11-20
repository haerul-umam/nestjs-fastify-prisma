import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repositoriy';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class GetUsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute() {
    const { meta, users } = await this.userRepository.getAll();
    return {
      meta,
      users: users.map((user) => UserMapper.toResponseDto(user)),
    };
  }
}
