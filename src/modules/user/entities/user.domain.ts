export class User {
  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly id?: number | null,
  ) {}

  static createNew(name: string, email: string) {
    return new User(email, name);
  }

  verifyPassword(password: string) {
    // Dummy implementation for example purposes
    return password === 'password123';
  }
}
