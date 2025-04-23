/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Decimal } from '@prisma/client/runtime/library';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorator/message.response.decorator';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler()) ||
      'Success';
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    // Check if 'Content-Disposition' header is set to handle file downloads
    const contentDisposition = response.getHeader('Content-Disposition');
    if (contentDisposition && contentDisposition.includes('attachment')) {
      // Skip transformPrismaDecimalation
      return next.handle() as any;
    }

    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        message,
        data: this.transformPrismaDecimal(data) as T,
      })),
    );
  }

  private transformPrismaDecimal(value: unknown): unknown {
    if (Array.isArray(value)) {
      // If value is an array, recursively transformPrismaDecimal each element
      return value.map((item) => this.transformPrismaDecimal(item));
    }

    if (value && typeof value === 'object') {
      // If value is an object, recursively transformPrismaDecimal each key-value pair
      for (const key in value) {
        if (value[key] instanceof Decimal) {
          // Convert Decimal to number
          value[key] = value[key].toNumber();
        } else if (Array.isArray(value[key])) {
          // If the value is an array, recursively transformPrismaDecimal it
          value[key] = value[key].map((item) =>
            this.transformPrismaDecimal(item),
          );
        } else if (typeof value[key] === 'object' && value[key] !== null) {
          // If the value is another object, recursively transformPrismaDecimal it
          value[key] = this.transformPrismaDecimal(value[key]);
        }
      }
    }
    return value;
  }
}
