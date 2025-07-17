import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UploadModelDto } from './dto/upload-model.dto';
import { AIService } from '../ai/ai.service';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { existsSync } from 'fs';

export interface ModelProcessResult {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  resultUrl?: string;
  error?: string;
}

export interface DownloadResult {
  filePath: string;
  filename: string;
}

@Injectable()
export class ModelsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AIService
  ) {}

  async uploadModel(file: Express.Multer.File, uploadData: UploadModelDto, userId: number): Promise<ModelProcessResult> {
    const modelId = uuidv4();
    
    // 创建处理记录并关联用户
    const processRecord = await this.prisma.modelProcess.create({
      data: {
        id: modelId,
        originalFilename: file.originalname,
        filePath: file.path,
        userPrompt: uploadData.userPrompt,
        templateId: uploadData.templateId,
        promptWeight: parseFloat(uploadData.promptWeight),
        status: 'processing',
        progress: 0,
        userId: userId,
        createdAt: new Date()
      }
    });

    // 异步开始处理
    this.processModel(modelId, file.path, uploadData, userId).catch(error => {
      console.error('模型处理失败:', error);
      this.updateProcessStatus(modelId, 'failed', 0, error.message);
    });

    return {
      id: modelId,
      status: 'processing',
      progress: 0
    };
  }

  async getProcessStatus(modelId: string, userId: number): Promise<ModelProcessResult> {
    const record = await this.prisma.modelProcess.findUnique({
      where: { id: modelId }
    });

    if (!record) {
      throw new NotFoundException('处理记录不存在');
    }

    // 验证用户权限
    if (record.userId !== userId) {
      throw new NotFoundException('无权限访问此处理记录');
    }

    // 如果处理完成，生成下载URL
    let resultUrl: string | undefined;
    if (record.status === 'completed' && record.resultPath) {
      resultUrl = `/api/models/${modelId}/download`;
    }

    return {
      id: record.id,
      status: record.status as 'processing' | 'completed' | 'failed',
      progress: record.progress,
      resultUrl: resultUrl,
      error: record.error || undefined
    };
  }

  async getDownloadResult(modelId: string, userId: number): Promise<DownloadResult> {
    // 默认返回ZIP格式（包含所有文件）
    return this.getDownloadResultByFormat(modelId, 'zip', userId);
  }

  async getDownloadResultByFormat(modelId: string, format: string, userId: number): Promise<DownloadResult> {
    const record = await this.prisma.modelProcess.findUnique({
      where: { id: modelId },
      include: {
        files: true
      }
    });

    if (!record || record.status !== 'completed') {
      throw new NotFoundException('处理未完成或结果不存在');
    }

    // 验证用户权限
    if (record.userId !== userId) {
      throw new NotFoundException('无权限访问此处理记录');
    }

    if (!record.files || record.files.length === 0) {
      throw new NotFoundException('结果文件不存在');
    }

    // 根据格式找到对应的文件
    const targetFile = record.files.find(file => 
      file.fileType.toLowerCase() === format.toLowerCase()
    );

    if (!targetFile) {
      throw new NotFoundException(`未找到 ${format} 格式的结果文件`);
    }

    const filePath = targetFile.filePath;
    
    if (!existsSync(filePath)) {
      throw new NotFoundException('结果文件不存在于磁盘');
    }

    return {
      filePath,
      filename: targetFile.fileName
    };
  }

  private async processModel(modelId: string, filePath: string, uploadData: UploadModelDto, userId: number) {
    try {
      // 更新进度：开始处理
      await this.updateProcessStatus(modelId, 'processing', 10);

      // 调用AI服务进行处理
      const aiResult = await this.aiService.processModel({
        modelId,
        filePath,
        userPrompt: uploadData.userPrompt,
        templateId: uploadData.templateId,
        promptWeight: parseFloat(uploadData.promptWeight),
        userId: userId.toString()
      });

      // 更新进度：处理完成
      await this.updateProcessStatus(modelId, 'completed', 100, undefined, aiResult.resultPath, aiResult.resultFilename);

    } catch (error) {
      console.error('处理模型时发生错误:', error);
      
      // 提供更详细的错误信息
      let errorMessage = '处理失败';
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      // 如果是网络错误，提供更友好的提示
      if (error.message?.includes('ECONNREFUSED') || error.message?.includes('timeout')) {
        errorMessage = '无法连接到AI处理服务，请稍后重试';
      } else if (error.message?.includes('Magic Gradio Proxy')) {
        errorMessage = 'AI处理服务暂不可用，请稍后重试';
      }
      
      await this.updateProcessStatus(modelId, 'failed', 0, errorMessage);
    }
  }

  private async updateProcessStatus(
    modelId: string, 
    status: string, 
    progress: number, 
    error?: string,
    resultPath?: string,
    resultFilename?: string
  ) {
    await this.prisma.modelProcess.update({
      where: { id: modelId },
      data: {
        status,
        progress,
        error,
        resultPath,
        resultFilename,
        updatedAt: new Date()
      }
    });
  }
}