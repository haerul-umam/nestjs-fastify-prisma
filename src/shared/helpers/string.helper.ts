import { randomBytes } from 'crypto';

export function createShortId(length = 8): string {
  return randomBytes(length).toString('base64url');
}

export function createShortIdWithPrefix(prefix: string, length = 8): string {
  return `${prefix}-${createShortId(length)}`;
}
