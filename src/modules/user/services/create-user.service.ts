import { Injectable } from '@nestjs/common';
import { CreateUserDto, UniqueUserFieldDto } from '../dto/create-user.dto';
import { UserRepository } from '../repositories/user.repositoriy';
import { User } from '../entities/user.domain';
import { DuplicateFieldException } from '@application/errors/duplicate-field.error';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class CreateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(inputDto: CreateUserDto) {
    const uniqueField = new UniqueUserFieldDto();
    uniqueField.email = inputDto.email;
    uniqueField.username = inputDto.username;

    const existingUser =
      await this.userRepository.getByUniqueField(uniqueField);

    if (existingUser) {
      type UniqueUserFieldKey = keyof UniqueUserFieldDto;
      const field: UniqueUserFieldKey[] = ['email', 'username'];
      throw new DuplicateFieldException(inputDto, existingUser, field);
    }

    const newUser = await this.userRepository.create(User.createNew(inputDto));
    return UserMapper.toResponseDto(newUser);
  }
}
