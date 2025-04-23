import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/nestjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
  ignoreErrors: [
    /BadRequestException/i,
    /ForbiddenException/i,
    /NotFoundException/i,
    /UnauthorizedException/i,
    /HttpException/i,
  ],
  enabled: process.env.NODE_ENV === 'production',
});
