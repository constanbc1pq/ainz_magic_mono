import { IsString, IsOptional, IsNumber, IsInt, IsEnum } from 'class-validator';

export enum ModelSource {
  UPLOAD = 'UPLOAD',
  EXISTING_PROJECT = 'EXISTING_PROJECT'
}

export class ProcessModelDto {
  @IsString()
  projectId: string;

  @IsEnum(ModelSource)
  modelSource: ModelSource;

  @IsOptional()
  @IsString()
  modelName?: string;

  @IsOptional()
  @IsString()
  modelContent?: string; // base64 encoded, required if modelSource is UPLOAD

  @IsOptional()
  @IsInt()
  parentProjectId?: number; // required if modelSource is EXISTING_PROJECT

  @IsString()
  textPrompt: string;

  @IsOptional()
  @IsInt()
  seed?: number = 42;

  @IsOptional()
  @IsNumber()
  confidence?: number = 0.8;

  @IsOptional()
  preview?: boolean = true;
}