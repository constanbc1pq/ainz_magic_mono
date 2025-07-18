import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JwtPayload } from '../auth.service';

console.log('🔧 [JWT Strategy File] Loading JWT Strategy module...');
console.log('🔧 [JWT Strategy File] PassportStrategy type:', typeof PassportStrategy);
console.log('🔧 [JWT Strategy File] Strategy type:', typeof Strategy);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    console.log('🔧 [JWT Strategy] Constructor called');
    console.log('🔧 [JWT Strategy] JWT_SECRET configured:', process.env.JWT_SECRET ? '✓ Set' : '✗ Not set');
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
    
    console.log('🔧 [JWT Strategy] Strategy initialized');
  }

  async validate(payload: JwtPayload) {
    console.log('🔑 [JWT Strategy] validate called with payload:', payload);
    
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub, isActive: true },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        createdAt: true,
      },
    });

    console.log('🔑 [JWT Strategy] user found in database:', user);
    
    if (!user) {
      console.log('🔑 [JWT Strategy] User not found or inactive, throwing UnauthorizedException');
      throw new UnauthorizedException();
    }

    console.log('🔑 [JWT Strategy] validation successful, returning user');
    return user;
  }
}