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
    const response = await api.post('/api/auth/login', credentials);
    const authData = response.data.data;
    
    // 存储token
    this.setToken(authData.access_token);
    
    return authData;
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
}

export default new AuthService();