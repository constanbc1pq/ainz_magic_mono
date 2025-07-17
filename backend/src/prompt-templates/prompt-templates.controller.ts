import { Controller, Get } from '@nestjs/common';
import { PromptTemplatesService } from './prompt-templates.service';

@Controller('api/prompt-templates')
export class PromptTemplatesController {
  constructor(private readonly promptTemplatesService: PromptTemplatesService) {}

  @Get()
  async getPromptTemplates() {
    return await this.promptTemplatesService.getPromptTemplates();
  }
}