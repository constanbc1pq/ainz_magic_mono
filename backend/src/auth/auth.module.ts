import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../common/prisma/prisma.module';

console.log('🔧 [Auth Module] Loading AuthModule...');
console.log('🔧 [Auth Module] JwtStrategy imported:', !!JwtStrategy);
console.log('🔧 [Auth Module] JwtStrategy type:', typeof JwtStrategy);
console.log('🔧 [Auth Module] JwtStrategy name:', JwtStrategy.name);

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    AuthService, 
    LocalStrategy, 
    {
      provide: JwtStrategy,
      useClass: JwtStrategy,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}