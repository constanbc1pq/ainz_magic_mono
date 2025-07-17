import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request, NotFoundException, Res, StreamableFile, Query } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { JwtService } from '@nestjs/jwt';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProcessImageDto } from './dto/process-image.dto';
import { ProcessModelDto } from './dto/process-model.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly jwtService: JwtService
  ) {}

  @Post()
  async createProject(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    try {
      const project = await this.projectsService.createProject(req.user.id, createProjectDto);
      return project;
    } catch (error) {
      throw new NotFoundException('创建项目失败');
    }
  }

  @Get()
  async getProjects(@Request() req) {
    try {
      const projects = await this.projectsService.getProjects(req.user.id);
      return projects;
    } catch (error) {
      throw new NotFoundException('获取项目列表失败');
    }
  }

  @Get(':id')
  async getProject(@Request() req, @Param('id') id: string) {
    try {
      const project = await this.projectsService.getProject(parseInt(id), req.user.id);
      return project;
    } catch (error) {
      throw new NotFoundException('项目不存在');
    }
  }

  @Get(':id/status')
  async getProjectStatus(@Request() req, @Param('id') id: string) {
    try {
      const project = await this.projectsService.getProject(parseInt(id), req.user.id);
      return {
        id: project.id,
        status: project.status,
        progress: project.status === 'PROCESSING' ? 50 : (project.status === 'COMPLETED' ? 100 : 0),
        type: project.type,
        name: project.name,
        createdAt: project.createdAt
      };
    } catch (error) {
      throw new NotFoundException('项目不存在');
    }
  }

  @Post('process-image')
  async processImage(@Request() req, @Body() processImageDto: ProcessImageDto) {
    try {
      const result = await this.projectsService.processImage(req.user.id, processImageDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Post('process-model')
  async processModel(@Request() req, @Body() processModelDto: ProcessModelDto) {
    try {
      const result = await this.projectsService.processModel(req.user.id, processModelDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Get('user/model-files')
  async getUserModelFiles(@Request() req) {
    try {
      const modelFiles = await this.projectsService.getUserModelFiles(req.user.id);
      return modelFiles;
    } catch (error) {
      throw new NotFoundException('获取用户模型文件失败');
    }
  }

  @Delete(':id')
  async deleteProject(@Request() req, @Param('id') id: string) {
    try {
      await this.projectsService.deleteProject(parseInt(id), req.user.id);
      return { success: true, message: '项目删除成功' };
    } catch (error) {
      throw new NotFoundException('删除项目失败');
    }
  }

  @Get(':id/download/:fileType')
  async downloadProjectFile(
    @Request() req, 
    @Param('id') id: string, 
    @Param('fileType') fileType: string,
    @Query('token') token: string,
    @Res() res: Response
  ) {
    try {
      let userId: number;

      // 先尝试从Authorization header获取token
      let authToken = token;
      if (!authToken && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
          authToken = authHeader.substring(7);
        }
      }

      // 验证token并获取用户ID
      if (authToken) {
        try {
          const payload = this.jwtService.verify(authToken);
          userId = payload.sub;
        } catch (error) {
          throw new NotFoundException('无效的认证token');
        }
      } else {
        // 如果没有token，使用JWT Guard验证的用户
        if (req.user && req.user.id) {
          userId = req.user.id;
        } else {
          throw new NotFoundException('缺少认证信息');
        }
      }

      const project = await this.projectsService.getProject(parseInt(id), userId);
      
      if (!project) {
        throw new NotFoundException('项目不存在');
      }

      // 从数据库中查找实际的文件路径
      const projectFile = await this.projectsService.getProjectFile(parseInt(id), fileType);
      
      if (!projectFile) {
        throw new NotFoundException('文件记录不存在');
      }

      // 构建完整的文件路径
      const filePath = path.join(process.cwd(), projectFile.filePath);

      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('文件不存在');
      }

      // 设置内容类型
      let contentType: string;
      let fileName: string;
      
      switch (fileType) {
        case 'glb':
          contentType = 'model/gltf-binary';
          fileName = 'output.glb';
          break;
        case 'preview_video':
          contentType = 'video/mp4';
          fileName = 'preview.mp4';
          break;
        case 'obj':
          contentType = 'text/plain';
          fileName = 'skeleton.obj';
          break;
        case 'json':
          contentType = 'application/json';
          fileName = 'skeleton.json';
          break;
        case 'txt':
          contentType = 'text/plain';
          fileName = 'skeleton.txt';
          break;
        case 'zip':
          contentType = 'application/zip';
          fileName = 'skeleton.zip';
          break;
        case 'input_image':
          // 动态确定图片类型
          const imageExt = projectFile.fileName.substring(projectFile.fileName.lastIndexOf('.') + 1).toLowerCase();
          const imageMimeTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'bmp': 'image/bmp',
            'webp': 'image/webp'
          };
          contentType = imageMimeTypes[imageExt] || 'image/jpeg';
          fileName = projectFile.fileName;
          break;
        case 'input_model':
          // 动态确定模型类型
          const modelExt = projectFile.fileName.substring(projectFile.fileName.lastIndexOf('.') + 1).toLowerCase();
          const modelMimeTypes = {
            'glb': 'model/gltf-binary',
            'gltf': 'model/gltf+json',
            'obj': 'model/obj',
            'stl': 'model/stl',
            'ply': 'model/ply',
            'fbx': 'model/fbx'
          };
          contentType = modelMimeTypes[modelExt] || 'model/gltf-binary';
          fileName = projectFile.fileName;
          break;
        default:
          throw new NotFoundException('不支持的文件类型');
      }
      
      // 设置响应头
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      
      // 流式传输文件
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('下载文件失败');
    }
  }
}