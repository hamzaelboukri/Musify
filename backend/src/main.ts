import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const uploadsPath = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsPath)) {
    mkdirSync(join(uploadsPath, 'audio'), { recursive: true });
    mkdirSync(join(uploadsPath, 'images'), { recursive: true });
  } else {
    if (!existsSync(join(uploadsPath, 'audio'))) mkdirSync(join(uploadsPath, 'audio'), { recursive: true });
    if (!existsSync(join(uploadsPath, 'images'))) mkdirSync(join(uploadsPath, 'images'), { recursive: true });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Musify API running on http://localhost:${port}/api`);
}

bootstrap().catch(console.error);
