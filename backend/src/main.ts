import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 配置express body parser限制
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));
  
  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // 获取配置
  const configService = app.get(ConfigService);
  const allowedOrigins = configService.get('ALLOWED_ORIGINS')?.split(',') || ['http://localhost:3000'];
  
  // CORS配置
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? allowedOrigins.filter(origin => origin.includes('https'))
      : allowedOrigins,
    credentials: true,
  });

  // 获取端口配置
  const port = configService.get('PORT') || 5720;

  await app.listen(port);
  console.log(`🚀 ArticulateHub Backend running on port ${port}`);
}

bootstrap();