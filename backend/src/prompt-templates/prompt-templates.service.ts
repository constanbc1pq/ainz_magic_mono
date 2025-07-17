import { Injectable } from '@nestjs/common';

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: string;
}

@Injectable()
export class PromptTemplatesService {
  private readonly templates: PromptTemplate[] = [
    {
      id: 'realistic',
      name: '写实风格',
      description: '增强模型的写实感和细节',
      template: 'realistic, detailed, high quality, photorealistic',
      category: '风格'
    },
    {
      id: 'cartoon',
      name: '卡通风格',
      description: '转换为卡通/动画风格',
      template: 'cartoon style, animated, colorful, stylized',
      category: '风格'
    },
    {
      id: 'metallic',
      name: '金属质感',
      description: '添加金属材质效果',
      template: 'metallic surface, reflective, chrome, steel',
      category: '材质'
    },
    {
      id: 'wooden',
      name: '木质纹理',
      description: '应用木质材质和纹理',
      template: 'wooden texture, natural wood grain, organic',
      category: '材质'
    },
    {
      id: 'futuristic',
      name: '未来科技',
      description: '科幻未来风格',
      template: 'futuristic, sci-fi, high-tech, cyberpunk',
      category: '主题'
    },
    {
      id: 'vintage',
      name: '复古经典',
      description: '复古怀旧风格',
      template: 'vintage, retro, classic, aged, weathered',
      category: '主题'
    }
  ];

  async getPromptTemplates(): Promise<PromptTemplate[]> {
    return this.templates;
  }
}