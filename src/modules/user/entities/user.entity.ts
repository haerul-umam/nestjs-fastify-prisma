import { User } from '@prismaclient/client';

export class UserEntity implements User {
  id: number;
  email: string;
  name: string;
}
