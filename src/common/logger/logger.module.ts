import { Module } from '@nestjs/common';
import { ServerResponse } from 'http';
import { IncomingMessage } from 'http';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        autoLogging: true,
        serializers: {
          req(req: IncomingMessage & { raw?: any }) {
            return {
              method: req.method,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
              url: (req as any).url,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              ip: (req as any).raw?.socket?.remoteAddress,
            };
          },
          res(res: ServerResponse & { statusCode?: number }) {
            return { statusCode: res?.statusCode };
          },
        },
      },
    }),
  ],
  exports: [LoggerModule],
})
export class GameLoggerModule {}
