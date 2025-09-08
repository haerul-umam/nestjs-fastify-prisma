import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from '../repositories/user.repositoriy';
import { User } from '../entities/user.domain';

@Injectable()
export class CreateUserService {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(inputDto: CreateUserDto) {
    const existingUser = await this.userRepository.getByEmail(inputDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Convert DTO to domain entity
    const newUser = User.createNew(inputDto.name, inputDto.email);
    return this.userRepository.create(newUser);
  }
}
