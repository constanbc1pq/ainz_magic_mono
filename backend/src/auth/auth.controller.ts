import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Put, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return {
      success: true,
      message: '注册成功',
      data: user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      success: true,
      message: '登录成功',
      data: result,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req) {
    console.log('👤 [Auth Controller] getProfile called');
    console.log('👤 [Auth Controller] req.user:', req.user);
    
    const profile = await this.authService.getProfile(req.user.id);
    console.log('👤 [Auth Controller] profile retrieved:', profile);
    
    return {
      success: true,
      message: '获取用户信息成功',
      data: profile,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('profile')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const user = await this.authService.updateProfile(req.user.id, updateProfileDto);
    return {
      success: true,
      message: '更新用户信息成功',
      data: user,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    // JWT是无状态的，这里只是为了前端清除token
    return {
      success: true,
      message: '退出登录成功',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { email: string; newPassword: string }) {
    // 测试阶段：直接重置密码，无需验证
    const user = await this.authService.resetPassword(body.email, body.newPassword);
    return {
      success: true,
      message: '密码重置成功',
      data: {
        email: user.email,
        username: user.username,
      },
    };
  }
}