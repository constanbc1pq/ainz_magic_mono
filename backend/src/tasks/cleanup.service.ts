import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../common/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

@Injectable()
export class CleanupService {
  private readonly RETENTION_DAYS = parseInt(process.env.FILE_RETENTION_DAYS || '7');
  private readonly resultsDir = path.join(process.cwd(), process.env.RESULTS_DIR || 'results');

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupOldFiles() {
    console.log('开始清理过期文件...');
    
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.RETENTION_DAYS);

      // 查找过期的文件记录
      const expiredFiles = await this.prisma.processingFile.findMany({
        where: {
          createdAt: { lt: cutoffDate }
        },
        include: {
          modelProcess: true
        }
      });

      console.log(`发现 ${expiredFiles.length} 个过期文件`);

      let deletedFiles = 0;
      let deletedSize = 0;

      // 删除物理文件
      for (const file of expiredFiles) {
        try {
          if (fs.existsSync(file.filePath)) {
            const stats = await stat(file.filePath);
            await unlink(file.filePath);
            deletedFiles++;
            deletedSize += Number(stats.size);
            console.log(`已删除文件: ${file.filePath}`);
          }
        } catch (error) {
          console.error(`删除文件失败: ${file.filePath}`, error);
        }
      }

      // 删除数据库记录
      await this.prisma.processingFile.deleteMany({
        where: {
          createdAt: { lt: cutoffDate }
        }
      });

      // 清理空目录
      await this.cleanupEmptyDirectories();

      console.log(`清理完成: 删除了 ${deletedFiles} 个文件，释放了 ${(deletedSize / 1024 / 1024).toFixed(2)} MB 空间`);

    } catch (error) {
      console.error('清理文件时出错:', error);
    }
  }

  private async cleanupEmptyDirectories() {
    try {
      if (!fs.existsSync(this.resultsDir)) {
        return;
      }

      const dateDirs = await readdir(this.resultsDir);
      
      for (const dateDir of dateDirs) {
        const datePath = path.join(this.resultsDir, dateDir);
        const stats = await stat(datePath);
        
        if (stats.isDirectory()) {
          await this.cleanupEmptyProjectDirectories(datePath);
          
          // 检查日期目录是否为空
          const projectDirs = await readdir(datePath);
          if (projectDirs.length === 0) {
            await rmdir(datePath);
            console.log(`已删除空目录: ${datePath}`);
          }
        }
      }
    } catch (error) {
      console.error('清理空目录时出错:', error);
    }
  }

  private async cleanupEmptyProjectDirectories(datePath: string) {
    try {
      const projectDirs = await readdir(datePath);
      
      for (const projectDir of projectDirs) {
        const projectPath = path.join(datePath, projectDir);
        const stats = await stat(projectPath);
        
        if (stats.isDirectory()) {
          // 检查项目目录是否为空
          const files = await readdir(projectPath);
          if (files.length === 0) {
            await rmdir(projectPath);
            console.log(`已删除空目录: ${projectPath}`);
          }
        }
      }
    } catch (error) {
      console.error('清理空项目目录时出错:', error);
    }
  }

  // 手动清理方法
  async manualCleanup(retentionDays: number = this.RETENTION_DAYS) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const expiredFiles = await this.prisma.processingFile.findMany({
      where: {
        createdAt: { lt: cutoffDate }
      }
    });

    console.log(`手动清理: 发现 ${expiredFiles.length} 个过期文件 (${retentionDays} 天)`);

    for (const file of expiredFiles) {
      try {
        if (fs.existsSync(file.filePath)) {
          await unlink(file.filePath);
          console.log(`已删除文件: ${file.filePath}`);
        }
      } catch (error) {
        console.error(`删除文件失败: ${file.filePath}`, error);
      }
    }

    await this.prisma.processingFile.deleteMany({
      where: {
        createdAt: { lt: cutoffDate }
      }
    });

    await this.cleanupEmptyDirectories();

    return {
      deletedCount: expiredFiles.length,
      retentionDays
    };
  }

  // 获取存储统计信息
  async getStorageStats() {
    const files = await this.prisma.processingFile.findMany({
      select: {
        fileSizeBytes: true,
        createdAt: true,
        fileType: true
      }
    });

    const totalSize = files.reduce((sum, file) => sum + Number(file.fileSizeBytes), 0);
    const totalFiles = files.length;
    
    const now = new Date();
    const recentFiles = files.filter(file => {
      const daysDiff = (now.getTime() - file.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 1;
    });

    const fileTypeStats = files.reduce((stats, file) => {
      const type = file.fileType;
      if (!stats[type]) {
        stats[type] = { count: 0, size: 0 };
      }
      stats[type].count++;
      stats[type].size += Number(file.fileSizeBytes);
      return stats;
    }, {} as Record<string, { count: number; size: number }>);

    return {
      totalSize: totalSize,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
      totalFiles,
      recentFiles: recentFiles.length,
      fileTypeStats,
      retentionDays: this.RETENTION_DAYS
    };
  }
}