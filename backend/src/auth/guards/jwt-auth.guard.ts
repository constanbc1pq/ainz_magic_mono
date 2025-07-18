import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('==========================================');
    console.log('🔒 [JWT Guard] canActivate called - ENTRY POINT');
    console.log('==========================================');
    
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      console.log('🔒 [JWT Guard] Authorization header:', authHeader);
      console.log('🔒 [JWT Guard] Request URL:', request.url);
      console.log('🔒 [JWT Guard] Request method:', request.method);
      
      const result = super.canActivate(context);
      console.log('🔒 [JWT Guard] canActivate result:', result);
      return result;
    } catch (error) {
      console.error('❌ [JWT Guard] Error in canActivate:', error);
      throw error;
    }
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    console.log('==========================================');
    console.log('🔒 [JWT Guard] handleRequest called');
    console.log('==========================================');
    console.log('🔒 [JWT Guard] err:', err);
    console.log('🔒 [JWT Guard] user:', user);
    console.log('🔒 [JWT Guard] info:', info);
    
    if (err || !user) {
      console.log('🔒 [JWT Guard] Authentication failed, throwing UnauthorizedException');
      throw err || new UnauthorizedException('请先登录');
    }
    
    console.log('🔒 [JWT Guard] Authentication successful, returning user');
    return user;
  }
}