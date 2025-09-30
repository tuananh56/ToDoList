// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Parse và validate DTO
  app.useGlobalPipes(new ValidationPipe());

  // Cho phép FE gọi API từ port khác, gửi cookie
  app.enableCors({
    origin: 'http://localhost:3000', // URL FE của bạn (Next.js)
    credentials: true,
  });

  await app.listen(3001); // port BE
}
bootstrap();
