import { ErrorFields } from '@core/common/interfaces/error-field.interface';
import { ConflictException } from '@nestjs/common';

export class DuplicateFieldException extends ConflictException {
  constructor(
    input: Record<string, any>,
    existing: Record<string, any>,
    fields: string[],
  ) {
    const errors = fields.reduce((acc, field) => {
      if (existing[field] === input[field]) {
        acc.push({
          field,
          error: 'This field already exists',
        });
      }
      return acc;
    }, [] as ErrorFields);

    super(errors, 'User with given fields already exists');
  }
}
