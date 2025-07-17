import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { ProjectsModule } from './projects/projects.module';
import { ModelsModule } from './models/models.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AIModule } from './ai/ai.module';
import { PromptTemplatesModule } from './prompt-templates/prompt-templates.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 调度模块
    ScheduleModule.forRoot(),

    // Redis队列
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),

    // 静态文件服务
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // 功能模块
    PrismaModule,
    AuthModule,
    ProjectsModule,
    ModelsModule,
    AIModule,
    PromptTemplatesModule,
    TasksModule,
  ],
})
export class AppModule {}