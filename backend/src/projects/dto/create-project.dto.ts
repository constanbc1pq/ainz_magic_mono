import { IsString, IsEnum, IsOptional, IsInt } from 'class-validator';

export enum ProjectType {
  IMAGE_TO_3D = 'IMAGE_TO_3D',
  MODEL_TO_SKELETON = 'MODEL_TO_SKELETON'
}

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ProjectType)
  type: ProjectType;

  @IsOptional()
  @IsString()
  userPrompt?: string;

  @IsOptional()
  @IsInt()
  parentProjectId?: number;
}