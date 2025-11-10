import { Observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { MultipartValue } from '@fastify/multipart';
import { FastifyRequest } from 'fastify';
import { MultipartOptions } from '@shared/models/options.model';
import { getFileFromPart, validateFile } from '@shared/helpers/file.helper';

type FieldValidationMap = Record<string, MultipartOptions>;

export function MultipartInterceptor(
  fieldOptions: FieldValidationMap,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const req: FastifyRequest = context.switchToHttp().getRequest();

      if (!req.isMultipart())
        throw new HttpException(
          'The request should be a form-data',
          HttpStatus.BAD_REQUEST,
        );

      const files: Record<string, any[]> = {};
      const body: Record<string, any> = {};

      for await (const part of req.parts()) {
        if (part.type !== 'file') {
          body[part.fieldname] = (part as MultipartValue).value;
          continue;
        }

        const options = fieldOptions[part.fieldname];
        if (!options) {
          // Skip unregistered file fields
          continue;
        }

        const file = await getFileFromPart(part);
        const validationResult = await validateFile(file, options);

        if (validationResult)
          throw new HttpException(
            {
              message: [
                {
                  message: validationResult,
                  field: part.fieldname,
                },
              ],
              statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );

        files[part.fieldname] = files[part.fieldname] || [];
        files[part.fieldname].push(file);
      }

      req.storedFiles = files;
      req.body = body;
      return next.handle();
    }
  }

  return mixin(MixinInterceptor);
}
