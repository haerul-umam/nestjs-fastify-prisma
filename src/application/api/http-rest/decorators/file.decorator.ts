import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const Files = createParamDecorator(
  (
    _data: unknown,
    ctx: ExecutionContext,
  ): Record<string, Storage.MultipartFile[]> | null => {
    const req: FastifyRequest = ctx.switchToHttp().getRequest();
    return req.storedFiles;
  },
);
