import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repositoriy';

@Injectable()
export class GetUsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute() {
    const users = await this.userRepository.getAll();
    return users;
  }
}
