import { User } from '../entities/user.domain';

export class UserMapper {
  static toResponseDto(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      isActive: user.is_active,
    };
  }
}
