import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repositoriy';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class GetUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: UserEntity['id']) {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return UserMapper.toResponseDto(user);
  }
}
