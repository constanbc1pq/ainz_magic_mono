import { 
  Controller, 
  Post, 
  Get, 
  Param, 
  Body, 
  UploadedFile, 
  UseInterceptors, 
  BadRequestException,
  NotFoundException,
  Res,
  HttpStatus,
  UseGuards,
  Request
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ModelsService } from './models.service';
import { UploadModelDto } from './dto/upload-model.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/models')
@UseGuards(JwtAuthGuard)
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      const allowedExtensions = ['.obj', '.fbx', '.glb', '.gltf', '.ply', '.stl'];
      const ext = extname(file.originalname).toLowerCase();
      if (allowedExtensions.includes(ext)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('不支持的文件格式'), false);
      }
    },
    limits: {
      fileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600'), // 默认100MB
    }
  }))
  async uploadModel(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadModelDto: UploadModelDto,
    @Request() req
  ) {
    if (!file) {
      throw new BadRequestException('请选择要上传的文件');
    }

    try {
      const result = await this.modelsService.uploadModel(file, uploadModelDto, req.user.id);
      return {
        id: result.id,
        status: result.status,
        progress: result.progress,
        message: '文件上传成功，开始处理...'
      };
    } catch (error) {
      throw new BadRequestException('文件上传失败: ' + error.message);
    }
  }

  @Get(':id/status')
  async getProcessStatus(@Param('id') id: string, @Request() req) {
    try {
      const status = await this.modelsService.getProcessStatus(id, req.user.id);
      return status;
    } catch (error) {
      throw new NotFoundException('未找到该处理任务');
    }
  }

  @Get(':id/download')
  async downloadResult(@Param('id') id: string, @Res() res: Response, @Request() req) {
    try {
      const result = await this.modelsService.getDownloadResult(id, req.user.id);
      
      if (!result.filePath) {
        throw new NotFoundException('结果文件不存在');
      }

      // 设置正确的Content-Type
      const contentType = this.getContentType(result.filename);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      
      return res.sendFile(result.filePath);
    } catch (error) {
      throw new NotFoundException('下载失败: ' + error.message);
    }
  }

  @Get(':id/download/:format')
  async downloadResultByFormat(
    @Param('id') id: string, 
    @Param('format') format: string,
    @Res() res: Response,
    @Request() req
  ) {
    try {
      const result = await this.modelsService.getDownloadResultByFormat(id, format, req.user.id);
      
      if (!result.filePath) {
        throw new NotFoundException('结果文件不存在');
      }

      const contentType = this.getContentType(result.filename);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      
      return res.sendFile(result.filePath);
    } catch (error) {
      throw new NotFoundException('下载失败: ' + error.message);
    }
  }

  private getContentType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'json':
        return 'application/json';
      case 'obj':
        return 'model/obj';
      case 'txt':
        return 'text/plain';
      case 'zip':
        return 'application/zip';
      default:
        return 'application/octet-stream';
    }
  }
}