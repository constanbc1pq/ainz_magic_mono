import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateProjectDto, ProjectType } from './dto/create-project.dto';
import { ProcessImageDto } from './dto/process-image.dto';
import { ProcessModelDto, ModelSource } from './dto/process-model.dto';
import { ProjectStatus } from '@prisma/client';
import axios from 'axios';

export interface ProjectData {
  id: number;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  createdAt: string;
  description?: string;
  userPrompt?: string;
  parentProjectId?: number;
  files?: Array<{
    id: string;
    fileName: string;
    fileType: string;
    isInput: boolean;
    createdAt: string;
  }>;
}

export interface UserModelFile {
  id: number;
  projectId: number;
  projectName: string;
  fileName: string;
  fileType: string;
  createdAt: string;
}

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProject(userId: number, createProjectDto: CreateProjectDto): Promise<ProjectData> {
    const project = await this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        type: createProjectDto.type as any,
        userPrompt: createProjectDto.userPrompt,
        parentProjectId: createProjectDto.parentProjectId,
        userId: userId,
        status: 'CREATED'
      }
    });

    return this.formatProjectData(project);
  }

  async getProjects(userId: number): Promise<ProjectData[]> {
    const projects = await this.prisma.project.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return projects.map(project => this.formatProjectData(project));
  }

  async getProject(projectId: number, userId: number): Promise<ProjectData> {
    const project = await this.prisma.project.findFirst({
      where: { 
        id: projectId,
        userId: userId
      }
    });

    if (!project) {
      throw new NotFoundException('项目不存在');
    }

    return this.formatProjectData(project);
  }

  async getProjectFile(projectId: number, fileType: string) {
    // 判断是否为输入文件
    const isInputFile = fileType === 'input_image' || fileType === 'input_model';
    
    return await this.prisma.projectFile.findFirst({
      where: {
        projectId: projectId,
        fileType: fileType,
        isInput: isInputFile // 输入文件用true，输出文件用false
      },
      orderBy: {
        createdAt: 'desc' // 获取最新的文件
      }
    });
  }

  async processImage(userId: number, processImageDto: ProcessImageDto): Promise<any> {
    console.log('🎨 开始处理图片生成3D模型请求', {
      userId,
      projectId: processImageDto.projectId,
      imageName: processImageDto.imageName,
      imageSize: processImageDto.imageContent?.length || 0,
      parameters: {
        seed: processImageDto.seed,
        guidance: processImageDto.ssGuidanceStrength,
        steps: processImageDto.ssSamplingSteps
      }
    });

    const project = await this.prisma.project.findFirst({
      where: { 
        id: parseInt(processImageDto.projectId),
        userId: userId,
        type: 'IMAGE_TO_3D' as any
      }
    });

    if (!project) {
      console.error('❌ 项目不存在', { projectId: processImageDto.projectId, userId });
      throw new NotFoundException('项目不存在或类型不匹配');
    }

    console.log('✅ 找到项目，开始处理', { projectId: project.id, projectName: project.name });

    // 更新项目状态
    await this.prisma.project.update({
      where: { id: project.id },
      data: { status: 'PROCESSING' }
    });

    console.log('📋 项目状态已更新为PROCESSING，启动异步处理');

    // 启动异步处理（不等待结果）
    this.processImageAsync(project.id, processImageDto);

    // 立即返回处理中状态
    return {
      success: true,
      projectId: project.id,
      status: 'PROCESSING',
      message: '图片处理已开始，请稍后查看结果'
    };
  }

  private async processImageAsync(projectId: number, processImageDto: ProcessImageDto): Promise<void> {
    try {
      console.log('🚀 异步调用Magic Gradio Proxy处理图片', {
        proxyUrl: process.env.MAGIC_PROXY_URL,
        endpoint: '/image-to-3d',
        projectId
      });

      // 先保存输入图片
      console.log('💾 保存输入图片');
      await this.saveProjectFiles(projectId, {
        'input_image': processImageDto.imageContent
      }, true, processImageDto.imageName);

      // 调用Magic Gradio Proxy的image-to-3d端点
      const response = await axios.post(`${process.env.MAGIC_PROXY_URL}/image-to-3d`, {
        image_name: processImageDto.imageName,
        image_content: processImageDto.imageContent,
        seed: processImageDto.seed,
        ss_guidance_strength: processImageDto.ssGuidanceStrength,
        ss_sampling_steps: processImageDto.ssSamplingSteps,
        slat_guidance_strength: processImageDto.slatGuidanceStrength,
        slat_sampling_steps: processImageDto.slatSamplingSteps,
        mesh_simplify: processImageDto.meshSimplify,
        texture_size: processImageDto.textureSize
      });

      console.log('✅ 异步处理Magic Gradio Proxy响应接收', {
        success: response.data.success,
        hasFiles: !!response.data.files,
        fileTypes: response.data.files ? Object.keys(response.data.files) : [],
        responseStatus: response.status
      });

      if (response.data.success) {
        console.log('📁 异步处理开始保存生成的文件', {
          projectId,
          fileCount: Object.keys(response.data.files || {}).length
        });

        // 保存生成的文件
        await this.saveProjectFiles(projectId, response.data.files, false);
        
        console.log('💾 异步处理文件保存完成，更新项目状态为COMPLETED');

        // 更新项目状态
        await this.prisma.project.update({
          where: { id: projectId },
          data: { status: 'COMPLETED' }
        });

        console.log('🎉 异步图片生成3D模型处理完成', { projectId });
      } else {
        console.error('❌ 异步处理Magic Gradio Proxy失败', {
          error: response.data.error,
          errorMessage: response.data.error_message
        });

        await this.prisma.project.update({
          where: { id: projectId },
          data: { status: 'FAILED' }
        });
      }
    } catch (error) {
      console.error('❌ 异步图片生成3D模型处理异常', {
        projectId,
        errorMessage: error.message,
        errorType: error.constructor.name,
        responseData: error.response?.data || null,
        responseStatus: error.response?.status || null
      });

      await this.prisma.project.update({
        where: { id: projectId },
        data: { status: 'FAILED' }
      });
    }
  }

  async processModel(userId: number, processModelDto: ProcessModelDto): Promise<any> {
    console.log('🦴 开始处理3D模型生成骨骼请求', {
      userId,
      projectId: processModelDto.projectId,
      modelSource: processModelDto.modelSource,
      textPrompt: processModelDto.textPrompt,
      confidence: processModelDto.confidence
    });

    const project = await this.prisma.project.findFirst({
      where: { 
        id: parseInt(processModelDto.projectId),
        userId: userId,
        type: 'MODEL_TO_SKELETON' as any
      }
    });

    if (!project) {
      console.error('❌ 项目不存在', { projectId: processModelDto.projectId, userId });
      throw new NotFoundException('项目不存在或类型不匹配');
    }

    console.log('✅ 找到项目，开始处理', { projectId: project.id, projectName: project.name });

    // 更新项目状态
    await this.prisma.project.update({
      where: { id: project.id },
      data: { status: 'PROCESSING' }
    });

    console.log('📋 项目状态已更新为PROCESSING，启动异步处理');

    // 启动异步处理（不等待结果）
    this.processModelAsync(project.id, processModelDto);

    // 立即返回处理中状态
    return {
      success: true,
      projectId: project.id,
      status: 'PROCESSING',
      message: '模型处理已开始，请稍后查看结果'
    };
  }

  private async processModelAsync(projectId: number, processModelDto: ProcessModelDto): Promise<void> {
    try {
      console.log('🚀 异步处理3D模型生成骨骼', {
        proxyUrl: process.env.MAGIC_PROXY_URL,
        endpoint: '/model-to-skeleton',
        projectId
      });

      // 获取项目信息
      const project = await this.prisma.project.findUnique({
        where: { id: projectId }
      });

      if (!project) {
        throw new Error('Project not found');
      }

      let modelContent = '';
      let modelName = '';

      if (processModelDto.modelSource === ModelSource.UPLOAD) {
        if (!processModelDto.modelContent || !processModelDto.modelName) {
          throw new BadRequestException('上传模式需要提供模型内容和名称');
        }
        modelContent = processModelDto.modelContent;
        modelName = processModelDto.modelName;
      } else if (processModelDto.modelSource === ModelSource.EXISTING_PROJECT) {
        if (!processModelDto.parentProjectId) {
          throw new BadRequestException('选择已有模型需要提供父项目ID');
        }
        
        // 获取父项目的3D模型文件
        const parentProject = await this.prisma.project.findFirst({
          where: {
            id: processModelDto.parentProjectId,
            userId: project.userId,
            type: 'IMAGE_TO_3D' as any
          }
        });

        if (!parentProject) {
          throw new NotFoundException('父项目不存在');
        }

        // 获取父项目的文件
        const parentFiles = await this.prisma.projectFile.findMany({
          where: {
            projectId: parentProject.id,
            isInput: false,
            fileType: 'glb'
          }
        });

        if (!parentFiles.length) {
          throw new NotFoundException('父项目没有可用的3D模型文件');
        }

        // 读取文件内容
        const fs = require('fs');
        const modelFile = parentFiles[0];
        try {
          const fileBuffer = fs.readFileSync(modelFile.filePath);
          modelContent = fileBuffer.toString('base64');
          modelName = modelFile.fileName;
        } catch (error) {
          throw new BadRequestException('读取模型文件失败');
        }

        // 更新项目关联
        await this.prisma.project.update({
          where: { id: project.id },
          data: { parentProjectId: processModelDto.parentProjectId } as any
        });
      }

      // 保存输入的3D模型
      console.log('💾 异步处理保存输入3D模型');
      await this.saveProjectFiles(project.id, {
        'input_model': modelContent
      }, true, modelName);

      // 调用Magic Gradio Proxy的model-to-skeleton端点
      const response = await axios.post(`${process.env.MAGIC_PROXY_URL}/model-to-skeleton`, {
        file_name: modelName,
        file_content: modelContent,
        text_prompt: processModelDto.textPrompt || '',
        confidence: processModelDto.confidence || 0.8,
        preview: processModelDto.preview || true
      });

      console.log('✅ 异步处理Magic Gradio Proxy响应接收', {
        success: response.data.success,
        hasFiles: !!response.data.file_contents,
        fileTypes: response.data.file_contents ? Object.keys(response.data.file_contents) : [],
        responseStatus: response.status
      });

      if (response.data.success) {
        console.log('📁 异步处理开始保存生成的文件', {
          projectId,
          fileCount: Object.keys(response.data.file_contents || {}).length
        });

        // 保存生成的文件
        await this.saveProjectFiles(project.id, response.data.file_contents, false);
        
        console.log('💾 异步处理文件保存完成，更新项目状态为COMPLETED');

        // 更新项目状态
        await this.prisma.project.update({
          where: { id: project.id },
          data: { status: 'COMPLETED' }
        });

        console.log('🎉 异步3D模型生成骨骼处理完成', { projectId });
      } else {
        console.error('❌ 异步处理Magic Gradio Proxy失败', {
          error: response.data.error,
          errorMessage: response.data.error_message
        });

        await this.prisma.project.update({
          where: { id: project.id },
          data: { status: 'FAILED' }
        });
      }
    } catch (error) {
      console.error('❌ 异步3D模型生成骨骼处理异常', {
        projectId,
        errorMessage: error.message,
        errorType: error.constructor.name,
        responseData: error.response?.data || null,
        responseStatus: error.response?.status || null
      });

      await this.prisma.project.update({
        where: { id: projectId },
        data: { status: 'FAILED' }
      });
    }
  }

  async getUserModelFiles(userId: number): Promise<UserModelFile[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        userId: userId,
        type: 'IMAGE_TO_3D' as any,
        status: 'COMPLETED'
      }
    });

    const modelFiles: UserModelFile[] = [];
    
    for (const project of projects) {
      const files = await this.prisma.projectFile.findMany({
        where: {
          projectId: project.id,
          isInput: false,
          fileType: 'glb'
        }
      });

      files.forEach(file => {
        modelFiles.push({
          id: project.id,
          projectId: project.id,
          projectName: project.name,
          fileName: file.fileName,
          fileType: file.fileType,
          createdAt: file.createdAt.toISOString()
        });
      });
    }

    return modelFiles;
  }

  private formatProjectData(project: any): ProjectData {
    return {
      id: project.id,
      name: project.name,
      type: project.type as ProjectType,
      status: project.status,
      createdAt: project.createdAt.toISOString(),
      description: project.description,
      userPrompt: project.userPrompt,
      parentProjectId: project.parentProjectId
    };
  }

  private async saveProjectFiles(projectId: number, files: { [key: string]: string }, isInput: boolean = false, originalFileName?: string) {
    const fs = require('fs');
    const path = require('path');
    
    // 获取当前用户ID (这个方法被调用时应该在上下文中)
    // 对于异步处理，我们需要从project中获取userId
    const project = await this.prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    // 创建项目文件目录 - 使用project_${projectId}格式保持一致性
    const resultsDir = process.env.RESULTS_DIR || 'results';
    const today = new Date().toISOString().split('T')[0];
    const projectDir = path.join(resultsDir, today, `project_${projectId}`);
    fs.mkdirSync(projectDir, { recursive: true });

    for (const [fileType, content] of Object.entries(files)) {
      // 使用与下载端点一致的文件名
      let fileName: string;
      switch (fileType) {
        case 'glb':
          fileName = 'output.glb';
          break;
        case 'preview_video':
          fileName = 'preview.mp4';
          break;
        case 'obj':
          fileName = 'skeleton.obj';
          break;
        case 'json':
          fileName = 'skeleton.json';
          break;
        case 'txt':
          fileName = 'skeleton.txt';
          break;
        case 'zip':
          fileName = 'skeleton.zip';
          break;
        case 'input_image':
          if (originalFileName) {
            // 保持原始文件名和扩展名
            fileName = `input_${originalFileName}`;
          } else {
            fileName = 'input.jpg';
          }
          break;
        case 'input_model':
          if (originalFileName) {
            // 保持原始文件名和扩展名
            fileName = `input_${originalFileName}`;
          } else {
            fileName = 'input.glb';
          }
          break;
        default:
          fileName = `${fileType}.${this.getFileExtension(fileType)}`;
      }
      
      const filePath = path.join(projectDir, fileName);
      
      // 保存文件
      fs.writeFileSync(filePath, Buffer.from(content, 'base64'));
      
      // 保存到数据库
      await this.prisma.projectFile.create({
        data: {
          fileName: fileName,
          filePath: filePath,
          fileType: fileType,
          fileSize: BigInt(Buffer.from(content, 'base64').length),
          mimeType: this.getMimeType(fileType, fileName),
          isInput: isInput,
          projectId: projectId
        }
      });
    }
  }

  private getFileExtension(fileType: string): string {
    const extensions = {
      'glb': 'glb',
      'obj': 'obj',
      'json': 'json',
      'txt': 'txt',
      'zip': 'zip',
      'preview_video': 'mp4'
    };
    return extensions[fileType] || 'bin';
  }

  async deleteProject(projectId: number, userId: number): Promise<void> {
    // 验证项目存在且属于当前用户
    const project = await this.prisma.project.findFirst({
      where: { 
        id: projectId,
        userId: userId
      }
    });

    if (!project) {
      throw new NotFoundException('项目不存在或无权限删除');
    }

    const fs = require('fs');
    const path = require('path');

    try {
      // 删除项目相关的文件记录和物理文件
      const projectFiles = await this.prisma.projectFile.findMany({
        where: { projectId: projectId }
      });

      // 删除物理文件
      for (const file of projectFiles) {
        try {
          if (fs.existsSync(file.filePath)) {
            fs.unlinkSync(file.filePath);
            console.log(`已删除文件: ${file.filePath}`);
          }
        } catch (error) {
          console.error(`删除文件失败: ${file.filePath}`, error);
        }
      }

      // 删除文件记录
      await this.prisma.projectFile.deleteMany({
        where: { projectId: projectId }
      });

      // 删除项目记录
      await this.prisma.project.delete({
        where: { id: projectId }
      });

      console.log(`项目删除成功: ${projectId}`);

    } catch (error) {
      console.error(`删除项目失败: ${projectId}`, error);
      throw new BadRequestException('删除项目失败');
    }
  }

  private getMimeType(fileType: string, fileName?: string): string {
    // 对于输入文件，根据文件扩展名判断MIME类型
    if (fileType === 'input_image' && fileName) {
      const ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
      const imageMimeTypes = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'bmp': 'image/bmp',
        'webp': 'image/webp'
      };
      return imageMimeTypes[ext] || 'image/jpeg';
    }
    
    if (fileType === 'input_model' && fileName) {
      const ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
      const modelMimeTypes = {
        'glb': 'model/gltf-binary',
        'gltf': 'model/gltf+json',
        'obj': 'model/obj',
        'stl': 'model/stl',
        'ply': 'model/ply',
        'fbx': 'model/fbx'
      };
      return modelMimeTypes[ext] || 'model/gltf-binary';
    }
    
    // 默认的MIME类型映射
    const mimeTypes = {
      'glb': 'model/gltf-binary',
      'obj': 'model/obj',
      'json': 'application/json',
      'txt': 'text/plain',
      'zip': 'application/zip',
      'preview_video': 'video/mp4'
    };
    return mimeTypes[fileType] || 'application/octet-stream';
  }
}