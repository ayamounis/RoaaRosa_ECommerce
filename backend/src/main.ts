import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Global Route Prefix: /api/v1
  app.setGlobalPrefix('api/v1');

  // 2. CORS Configuration with custom 'token' header support
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman) or localhost:3000
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev mode
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['token'],
  });

  // 3. Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // 4. Global Exception Filter (Frontend compatibility format)
  app.useGlobalFilters(new HttpExceptionFilter());

  // 5. Global Response Transform Interceptor (_id / id dual compatibility)
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  // 6. Graceful Shutdown Hooks
  app.enableShutdownHooks();

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  await app.listen(port);

  logger.log(`🚀 Clothing E-Commerce Backend running on: http://localhost:${port}/api/v1`);
  logger.log(`🩺 Health check available at: http://localhost:${port}/api/v1/health`);
}

bootstrap();
