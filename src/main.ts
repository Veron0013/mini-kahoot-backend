import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const port = process.env.PORT ?? 3099;

  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useLogger(app.get(Logger));

  await app.listen(port);
  console.log(`Homepage: http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('❌ Application bootstrap failed:', err);
  process.exit(1);
});
