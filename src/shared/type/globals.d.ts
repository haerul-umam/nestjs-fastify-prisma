declare namespace Storage {
  interface MultipartFile {
    buffer: Buffer;
    filename: string;
    size: number;
    mimetype: string;
    fieldname: string;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    storedFiles: Record<string, Storage.MultipartFile[]>;
    body: unknown;
  }
}

namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    SENTRY_DSN: string;
    SHOW_PRISMA_QUERIES: string;
    NODE_ENV: string;
    PORT: string;
  }
}
