import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { TIME_ZONE } from '@shared/constants';

export const loggerInstance = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'log/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'log/warn.log',
      level: 'warn',
    }),
    new winston.transports.DailyRotateFile({
      filename: 'log/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '14d',
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'log/exception.log' }),
    new winston.transports.Console(),
  ],
  format: winston.format.printf(
    (info) =>
      `${new Date().toLocaleString('en-GB', { timeZone: TIME_ZONE })} : ${info.message as any}`,
  ),
});

if (process.env.NODE_ENV !== 'production') {
  loggerInstance.add(new winston.transports.Console({ level: 'error' }));
}
