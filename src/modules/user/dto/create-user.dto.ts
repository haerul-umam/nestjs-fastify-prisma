import { IsBoolean, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsString()
  passwordHash: string;

  @IsBoolean()
  isActive: boolean;
}

export class UniqueUserFieldDto {
  email?: string;
  username?: string;
}
