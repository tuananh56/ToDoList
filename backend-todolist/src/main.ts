// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // dùng NestExpressApplication để serve static
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Parse và validate DTO
  app.useGlobalPipes(new ValidationPipe());

  // Cho phép FE gọi API từ port khác, gửi cookie
  app.enableCors({
    origin: 'http://localhost:3000', // URL FE của bạn (Next.js)
    credentials: true,
  });

  // Cho phép truy cập file trong thư mục uploads qua http://localhost:3001/uploads/...
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // endpoint public
  });

  await app.listen(3001); // port BE
}
bootstrap();
