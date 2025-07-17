import { IsOptional, IsString, MinLength, MaxLength, Matches, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: '用户名必须是字符串' })
  @MinLength(3, { message: '用户名至少需要3个字符' })
  @MaxLength(20, { message: '用户名最多20个字符' })
  @Matches(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, { 
    message: '用户名只能包含字母、数字、下划线和中文字符' 
  })
  username?: string;

  @IsOptional()
  @IsString({ message: '头像必须是字符串' })
  @IsUrl({}, { message: '头像必须是有效的URL' })
  avatar?: string;
}