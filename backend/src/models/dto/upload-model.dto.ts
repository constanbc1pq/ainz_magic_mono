import { IsString, IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class UploadModelDto {
  @IsString()
  @IsNotEmpty()
  userPrompt: string;

  @IsString()
  @IsNotEmpty()
  templateId: string;

  @IsNumberString()
  @IsNotEmpty()
  promptWeight: string;
}