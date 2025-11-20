import { User } from '@prismaclient/client';

export class UserEntity implements User {
  id: number;
  email: string;
  name: string;
  username: string;
  password_hash: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
