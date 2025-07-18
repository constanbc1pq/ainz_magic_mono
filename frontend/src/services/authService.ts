import api from './api';
import { debugLogger } from '../utils/debugLogger';

export interface User {
  id: number;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
  _count?: {
    projects: number;
    modelProcesses: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface UpdateProfileData {
  username?: string;
  avatar?: string;
}

class AuthService {
  // 获取存储的token
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // 设置token
  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // 清除token
  clearToken(): void {
    localStorage.removeItem('access_token');
  }

  // 检查是否已登录
  isAuthenticated(): boolean {
    const token = this.getToken();
    debugLogger.log('🔍 AuthService: isAuthenticated check', {
      hasToken: token !== null,
      tokenPreview: token ? token.substring(0, 30) + '...' : 'No token'
    });
    return token !== null;
  }

  // 用户注册
  async register(data: RegisterData): Promise<User> {
    const response = await api.post('/api/auth/register', data);
    return response.data.data;
  }

  // 用户登录
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🔐 AuthService: Login method called');
    console.log('📧 AuthService: Email:', credentials.email);
    console.log('🔒 AuthService: Password length:', credentials.password.length);
    
    try {
      console.log('🚀 AuthService: Making POST request to /api/auth/login');
      const response = await api.post('/api/auth/login', credentials);
      
      console.log('✅ AuthService: API response received');
      console.log('🔍 AuthService: Response status:', response.status);
      console.log('🔍 AuthService: Response data:', response.data);
      
      const authData = response.data.data;
      console.log('🔍 AuthService: Auth data extracted:', authData);
      
      if (!authData) {
        console.error('❌ AuthService: No auth data in response');
        throw new Error('No auth data received from server');
      }
      
      if (!authData.access_token) {
        console.error('❌ AuthService: No access token in auth data');
        throw new Error('No access token received');
      }
      
      console.log('🔑 AuthService: Storing token...');
      debugLogger.log('🔑 AuthService: Storing token', authData.access_token.substring(0, 30) + '...');
      this.setToken(authData.access_token);
      console.log('✅ AuthService: Token stored successfully');
      debugLogger.log('✅ AuthService: Token stored successfully');
      
      return authData;
    } catch (error: any) {
      console.error('❌ AuthService: Login failed');
      console.error('🔍 AuthService: Error details:', error);
      console.error('🔍 AuthService: Error message:', error.message);
      console.error('🔍 AuthService: Error response:', error.response);
      console.error('🔍 AuthService: Error response status:', error.response?.status);
      console.error('🔍 AuthService: Error response data:', error.response?.data);
      throw error;
    }
  }

  // 用户登出
  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      // 即使请求失败也要清除本地token
      console.error('Logout request failed:', error);
    } finally {
      this.clearToken();
    }
  }

  // 获取用户信息
  async getProfile(): Promise<User> {
    console.log('👤 AuthService: getProfile called');
    try {
      console.log('🚀 AuthService: Making request to /api/auth/profile');
      const response = await api.get('/api/auth/profile');
      console.log('✅ AuthService: Profile response received');
      console.log('🔍 AuthService: Profile response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ AuthService: getProfile failed');
      console.error('🔍 AuthService: Profile error:', error);
      throw error;
    }
  }

  // 更新用户信息
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put('/api/auth/profile', data);
    return response.data.data;
  }

  // 验证token是否有效
  async validateToken(): Promise<boolean> {
    console.log('🔍 AuthService: validateToken called');
    debugLogger.log('🔍 AuthService: validateToken called');
    try {
      console.log('👤 AuthService: Getting profile to validate token...');
      debugLogger.log('👤 AuthService: Getting profile to validate token...');
      const profile = await this.getProfile();
      console.log('✅ AuthService: Token validation successful');
      console.log('👤 AuthService: Profile data:', profile);
      debugLogger.log('✅ AuthService: Token validation successful', profile);
      return true;
    } catch (error: any) {
      console.error('❌ AuthService: Token validation failed');
      console.error('🔍 AuthService: Validation error:', error);
      debugLogger.error('❌ AuthService: Token validation failed', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data
      });
      this.clearToken();
      console.log('🗑️ AuthService: Token cleared due to validation failure');
      debugLogger.log('🗑️ AuthService: Token cleared due to validation failure');
      return false;
    }
  }

  // 重置密码
  async resetPassword(email: string, newPassword: string): Promise<void> {
    const response = await api.post('/api/auth/reset-password', {
      email,
      newPassword,
    });
    return response.data;
  }
}

export default new AuthService();