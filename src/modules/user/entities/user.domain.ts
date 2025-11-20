import { CreateUserDto } from '../dto/create-user.dto';

export interface UserNew {
  id: number | undefined;
  email: string;
  name: string;
  username: string;
  password_hash: string;
  is_active: boolean;
}

export class User {
  public readonly id: number | undefined;
  public readonly email: string;
  public readonly name: string;
  public readonly username: string;
  public readonly password_hash: string;
  public readonly is_active: boolean;

  constructor(user: UserNew) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.username = user.username;
    this.password_hash = user.password_hash;
    this.is_active = user.is_active;
  }

  static createNew(data: CreateUserDto) {
    return new User({
      id: undefined,
      email: data.email,
      name: data.name,
      username: data.username,
      password_hash: data.passwordHash,
      is_active: data.isActive,
    });
  }

  verifyPassword(password: string) {
    // Dummy implementation for example purposes
    return password === 'password123';
  }
}
