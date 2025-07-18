import api from './api';

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
    return this.getToken() !== null;
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
      
      this.setToken(authData.access_token);
      
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
    const response = await api.get('/api/auth/profile');
    return response.data.data;
  }

  // 更新用户信息
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put('/api/auth/profile', data);
    return response.data.data;
  }

  // 验证token是否有效
  async validateToken(): Promise<boolean> {
    try {
      await this.getProfile();
      return true;
    } catch (error) {
      this.clearToken();
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