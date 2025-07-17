import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';

export class ProcessImageDto {
  @IsString()
  projectId: string;

  @IsString()
  imageName: string;

  @IsString()
  imageContent: string; // base64 encoded

  @IsOptional()
  @IsInt()
  seed?: number = 0;

  @IsOptional()
  @IsNumber()
  ssGuidanceStrength?: number = 7.5;

  @IsOptional()
  @IsInt()
  ssSamplingSteps?: number = 12;

  @IsOptional()
  @IsNumber()
  slatGuidanceStrength?: number = 3.0;

  @IsOptional()
  @IsInt()
  slatSamplingSteps?: number = 12;

  @IsOptional()
  @IsNumber()
  meshSimplify?: number = 0.95;

  @IsOptional()
  @IsInt()
  textureSize?: number = 1024;
}