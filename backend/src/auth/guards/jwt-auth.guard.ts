import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('🔒 [JWT Guard] canActivate called');
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    console.log('🔒 [JWT Guard] Authorization header:', authHeader);
    
    const result = super.canActivate(context);
    console.log('🔒 [JWT Guard] canActivate result:', result);
    return result;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    console.log('🔒 [JWT Guard] handleRequest called');
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