import api from './api';

export interface UploadModelData {
  file: File;
  userPrompt: string;
  templateId: string;
  promptWeight: number;
}

export interface ModelProcessResult {
  id: string;
  status: 'created' | 'uploaded' | 'processing' | 'completed' | 'failed';
  progress: number;
  resultUrl?: string;
  resultPath?: string;
  error?: string;
}

export interface ProjectData {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  modelUrl?: string;
  resultUrl?: string;
}

class ModelService {
  // 上传模型并开始处理
  async uploadModel(data: UploadModelData): Promise<ModelProcessResult> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('userPrompt', data.userPrompt);
    formData.append('templateId', data.templateId);
    formData.append('promptWeight', data.promptWeight.toString());

    try {
      const response = await api.post('/api/models/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      // 提供更详细的错误信息
      let errorMessage = '模型上传失败';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 413) {
        errorMessage = '文件太大，请选择小于100MB的文件';
      } else if (error.response?.status === 400) {
        errorMessage = '文件格式不支持或参数错误';
      } else if (error.response?.status === 500) {
        errorMessage = '服务器内部错误，请稍后重试';
      } else if (error.message?.includes('Network Error')) {
        errorMessage = '网络连接失败，请检查网络连接';
      }
      
      throw new Error(errorMessage);
    }
  }

  // 获取处理状态
  async getProcessStatus(modelId: string): Promise<ModelProcessResult> {
    try {
      const response = await api.get(`/api/models/${modelId}/status`);
      return response.data;
    } catch (error: any) {
      let errorMessage = '获取处理状态失败';
      
      if (error.response?.status === 404) {
        errorMessage = '处理任务不存在';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  // 获取项目处理状态
  async getProjectStatus(projectId: string): Promise<ModelProcessResult> {
    try {
      const response = await api.get(`/api/projects/${projectId}/status`);
      return {
        id: response.data.id.toString(),
        status: this.mapProjectStatus(response.data.status),
        progress: response.data.progress || 0,
        resultUrl: response.data.status === 'COMPLETED' ? `/result/${projectId}` : undefined,
        error: response.data.status === 'FAILED' ? '处理失败' : undefined
      };
    } catch (error: any) {
      let errorMessage = '获取项目状态失败';
      
      if (error.response?.status === 404) {
        errorMessage = '项目不存在';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  // 映射项目状态到模型处理状态
  private mapProjectStatus(projectStatus: string): ModelProcessResult['status'] {
    switch (projectStatus) {
      case 'CREATED':
        return 'created';
      case 'PROCESSING': 
        return 'processing';
      case 'COMPLETED':
        return 'completed';
      case 'FAILED':
        return 'failed';
      default:
        return 'created';
    }
  }

  // 获取项目列表
  async getProjects(): Promise<ProjectData[]> {
    try {
      const response = await api.get('/api/projects');
      return response.data;
    } catch (error) {
      throw new Error('获取项目列表失败');
    }
  }

  // 获取项目详情
  async getProject(projectId: string): Promise<ProjectData> {
    try {
      const response = await api.get(`/api/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw new Error('获取项目详情失败');
    }
  }

  // 下载结果文件（默认ZIP格式）
  async downloadResult(modelId: string): Promise<Blob> {
    return this.downloadResultByFormat(modelId, 'zip');
  }

  // 按格式下载结果文件
  async downloadResultByFormat(modelId: string, format: string = 'zip'): Promise<Blob> {
    try {
      const response = await api.get(`/api/models/${modelId}/download/${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      let errorMessage = '下载结果失败';
      
      if (error.response?.status === 404) {
        errorMessage = `未找到 ${format} 格式的结果文件`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  // 获取提示词模板
  async getPromptTemplates(): Promise<any[]> {
    try {
      const response = await api.get('/api/prompt-templates');
      return response.data;
    } catch (error) {
      throw new Error('获取提示词模板失败');
    }
  }
}

const modelService = new ModelService();
export default modelService;