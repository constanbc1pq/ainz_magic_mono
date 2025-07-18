import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  sub: number;
  email: string;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email, isActive: true },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(registerDto: RegisterDto) {
    const { email, username, password } = registerDto;

    // 检查邮箱是否已存在
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('邮箱已被注册');
    }

    // 检查用户名是否已存在
    const existingUsername = await this.prisma.user.findFirst({
      where: { username },
    });

    if (existingUsername) {
      throw new BadRequestException('用户名已被使用');
    }

    // 密码加密
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 更新最后登录时间
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload: JwtPayload = { 
      sub: user.id, 
      email: user.email, 
      username: user.username 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    };
  }

  async getProfile(userId: number) {
    console.log('👤 [Auth Service] getProfile called with userId:', userId);
    
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            projects: true,
            modelProcesses: true,
          },
        },
      },
    });

    console.log('👤 [Auth Service] user found in database:', user);
    
    if (!user) {
      console.log('👤 [Auth Service] User not found, throwing UnauthorizedException');
      throw new UnauthorizedException('用户不存在');
    }

    console.log('👤 [Auth Service] returning user profile');
    return user;
  }

  async updateProfile(userId: number, updateData: { username?: string; avatar?: string }) {
    // 检查用户名是否已被其他用户使用
    if (updateData.username) {
      const existingUsername = await this.prisma.user.findFirst({
        where: { 
          username: updateData.username,
          id: { not: userId },
        },
      });

      if (existingUsername) {
        throw new BadRequestException('用户名已被使用');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    return user;
  }

  async resetPassword(email: string, newPassword: string) {
    // 查找用户
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('该邮箱未注册');
    }

    // 密码加密
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 更新密码
    const updatedUser = await this.prisma.user.update({
      where: { email },
      data: { 
        password: hashedPassword,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    return updatedUser;
  }
}