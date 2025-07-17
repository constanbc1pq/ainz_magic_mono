import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export interface ProcessModelRequest {
  modelId: string;
  filePath: string;
  userPrompt: string;
  templateId: string;
  promptWeight: number;
  userId?: string;
}

export interface ProcessModelResult {
  resultPath: string;
  resultFilename: string;
  downloadUrls?: Record<string, string>;
}

interface MagicGradioUploadRequest {
  file_name: string;
  file_content: string;
  file_type: string;
}

interface MagicGradioProcessRequest {
  file_name: string;
  file_content: string;
  text_prompt: string;
  confidence: number;
  preview: boolean;
  extra_params?: Record<string, any>;
}

@Injectable()
export class AIService {
  private readonly magicProxyUrl = process.env.MAGIC_PROXY_URL || 'http://localhost:5719';
  private readonly resultsDir = path.join(process.cwd(), process.env.RESULTS_DIR || 'results');

  constructor(private prisma: PrismaService) {
    // 确保results目录存在
    this.ensureResultsDirectory();
  }

  private async ensureResultsDirectory() {
    try {
      await mkdir(this.resultsDir, { recursive: true });
    } catch (error) {
      console.error('创建results目录失败:', error);
    }
  }

  async processModel(request: ProcessModelRequest): Promise<ProcessModelResult> {
    try {
      // 流式模式：直接读取文件内容并发送处理请求
      const fileContent = await readFile(request.filePath);
      const base64Content = fileContent.toString('base64');
      const fileName = path.basename(request.filePath);
      
      const processRequest: MagicGradioProcessRequest = {
        file_name: fileName,
        file_content: base64Content,
        text_prompt: request.userPrompt,
        confidence: 0.8,
        preview: true,
        extra_params: {
          modelId: request.modelId,
          templateId: request.templateId,
          promptWeight: request.promptWeight
        }
      };

      console.log('🔄 Sending streaming request to Magic Gradio Proxy:', {
        file_name: fileName,
        text_prompt: request.userPrompt,
        confidence: 0.8,
        preview: true,
        file_content_length: base64Content.length
      });
      
      const processResponse = await axios.post(
        `${this.magicProxyUrl}/process`,
        processRequest,
        {
          timeout: 300000, // 5分钟超时
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📥 Received response from Magic Gradio Proxy:', {
        success: processResponse.data.success,
        error_message: processResponse.data.error_message,
        hasFileContents: !!processResponse.data.file_contents,
        responseKeys: Object.keys(processResponse.data)
      });

      if (!processResponse.data.success) {
        throw new Error(`处理失败: ${processResponse.data.error_message || processResponse.data.error || '未知错误'}`);
      }

      // Step 3: Save files from API response
      const savedFiles = await this.saveFilesFromResponse(
        processResponse.data,
        request.modelId, // 这里的modelId实际上是projectId
        request.userId
      );

      return {
        resultPath: savedFiles.json || savedFiles.obj || '',
        resultFilename: `skeleton_${request.modelId}.json`,
        downloadUrls: this.createDownloadUrls(savedFiles, request.modelId) // modelId实际上是projectId
      };

    } catch (error) {
      console.error('Magic Gradio Proxy调用失败:', error.response?.data || error.message);
      throw new Error(`AI处理失败: ${error.response?.data?.error_message || error.message}`);
    }
  }

  // 移除uploadFileToProxy方法 - 流式模式下文件内容直接在process请求中发送

  private async saveFilesFromResponse(
    proxyResponse: any,
    projectId: string,
    userId?: string
  ): Promise<Record<string, string>> {
    const savedFiles: Record<string, string> = {};

    if (proxyResponse.file_contents) {
      // 创建项目目录，使用统一的project_${projectId}格式
      const projectDir = this.createProjectDirectory(projectId);
      await mkdir(projectDir, { recursive: true });

      // 保存每个文件
      for (const [fileType, base64Content] of Object.entries(proxyResponse.file_contents)) {
        const fileName = proxyResponse.file_names?.[fileType] || `output.${fileType}`;
        const filePath = path.join(projectDir, fileName);

        // 解码base64并保存
        const fileContent = Buffer.from(base64Content as string, 'base64');
        await writeFile(filePath, fileContent);

        savedFiles[fileType] = filePath;

        // 保存文件记录到数据库
        await this.saveFileRecord(projectId, fileType, filePath, fileName, fileContent.length);

        console.log(`文件已保存: ${fileType} -> ${filePath}`);
      }

      // 更新处理状态
      await this.prisma.modelProcess.update({
        where: { id: projectId },
        data: {
          filesSaved: true,
          filesSavedAt: new Date(),
          status: 'completed'
        }
      });
    }

    return savedFiles;
  }

  private async saveFileRecord(
    modelId: string,
    fileType: string,
    filePath: string,
    fileName: string,
    fileSize: number
  ) {
    // 映射文件类型到枚举
    const fileTypeMapping: Record<string, string> = {
      'obj': 'OBJ',
      'txt': 'TXT',
      'json': 'JSON',
      'zip': 'ZIP'
    };

    const enumFileType = fileTypeMapping[fileType] || 'JSON';

    await this.prisma.processingFile.create({
      data: {
        modelProcessId: modelId,
        fileType: enumFileType as any,
        filePath: filePath,
        fileName: fileName,
        fileSizeBytes: BigInt(fileSize)
      }
    });
  }

  private createProjectDirectory(projectId: string): string {
    const today = new Date().toISOString().split('T')[0];
    const projectDir = path.join(this.resultsDir, today, `project_${projectId}`);
    return projectDir;
  }

  private createDownloadUrls(savedFiles: Record<string, string>, projectId: string): Record<string, string> {
    const downloadUrls: Record<string, string> = {};
    
    for (const [fileType, filePath] of Object.entries(savedFiles)) {
      // 创建下载URL - 统一使用projects路由
      downloadUrls[fileType] = `/api/projects/${projectId}/download/${fileType}`;
    }

    return downloadUrls;
  }

  async getProcessStatus(modelId: string): Promise<any> {
    try {
      // Check Magic Gradio Proxy health as a status indicator
      const response = await axios.get(`${this.magicProxyUrl}/health`);
      
      return {
        status: response.data.connected_to_space ? 'ready' : 'disconnected',
        connected_to_space: response.data.connected_to_space,
        space_name: response.data.space_name,
        uptime: response.data.uptime,
        model_id: modelId
      };
    } catch (error) {
      console.error('获取Magic Gradio Proxy状态失败:', error.response?.data || error.message);
      throw new Error(`获取处理状态失败: ${error.response?.data?.error_message || error.message}`);
    }
  }

  async reconnectToSpace(): Promise<any> {
    try {
      const response = await axios.post(`${this.magicProxyUrl}/reconnect`);
      return response.data;
    } catch (error) {
      console.error('重连Magic Gradio Proxy失败:', error.response?.data || error.message);
      throw new Error(`重连失败: ${error.response?.data?.error_message || error.message}`);
    }
  }
}