import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, LoginCredentials, RegisterData, UpdateProfileData } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 检查用户是否已登录
  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 AuthContext: useEffect - Starting auth check');
      // 将关键信息写入sessionStorage以便调试
      sessionStorage.setItem('debug_auth_start', new Date().toISOString());
      
      try {
        const isAuth = authService.isAuthenticated();
        console.log('🔍 AuthContext: isAuthenticated result:', isAuth);
        sessionStorage.setItem('debug_is_authenticated', isAuth.toString());
        
        if (isAuth) {
          const token = authService.getToken();
          console.log('🔑 AuthContext: Token found:', token ? 'Yes' : 'No');
          console.log('🔑 AuthContext: Token preview:', token ? token.substring(0, 20) + '...' : 'None');
          sessionStorage.setItem('debug_token_exists', token ? 'true' : 'false');
          
          console.log('🔍 AuthContext: Validating token...');
          sessionStorage.setItem('debug_validating_token', 'true');
          
          const isValid = await authService.validateToken();
          console.log('🔍 AuthContext: Token validation result:', isValid);
          sessionStorage.setItem('debug_token_valid', isValid.toString());
          
          if (isValid) {
            console.log('👤 AuthContext: Getting user profile...');
            const userData = await authService.getProfile();
            console.log('👤 AuthContext: User profile received:', userData);
            sessionStorage.setItem('debug_profile_received', 'true');
            setUser(userData);
            console.log('✅ AuthContext: User state set successfully');
            sessionStorage.setItem('debug_user_set', 'true');
          } else {
            console.log('❌ AuthContext: Token validation failed');
            sessionStorage.setItem('debug_validation_failed', 'true');
          }
        } else {
          console.log('❌ AuthContext: No authentication found');
          sessionStorage.setItem('debug_no_auth', 'true');
        }
      } catch (error: any) {
        console.error('❌ AuthContext: Auth check failed:', error);
        sessionStorage.setItem('debug_auth_error', JSON.stringify({
          message: error?.message || 'Unknown error',
          status: error?.response?.status || 'No status',
          data: error?.response?.data || 'No data'
        }));
        authService.clearToken();
        console.log('🗑️ AuthContext: Token cleared due to error');
      } finally {
        console.log('🔄 AuthContext: Setting loading to false');
        sessionStorage.setItem('debug_loading_false', new Date().toISOString());
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    console.log('🔐 AuthContext: Login function called');
    console.log('📧 AuthContext: Email:', credentials.email);
    console.log('🔒 AuthContext: Password length:', credentials.password.length);
    
    try {
      console.log('🔄 AuthContext: Setting loading to true');
      setLoading(true);
      
      console.log('🚀 AuthContext: Calling authService.login...');
      const authData = await authService.login(credentials);
      
      console.log('✅ AuthContext: Login successful');
      console.log('👤 AuthContext: User data:', authData.user);
      console.log('🔑 AuthContext: Token received:', authData.access_token ? 'Yes' : 'No');
      
      setUser(authData.user);
      console.log('👤 AuthContext: User state updated');
    } catch (error) {
      console.error('❌ AuthContext: Login failed');
      console.error('🔍 AuthContext: Error details:', error);
      throw error;
    } finally {
      console.log('🔄 AuthContext: Setting loading to false');
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      const userData = await authService.register(data);
      // 注册成功后自动登录
      await login({ email: data.email, password: data.password });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    try {
      await authService.resetPassword(email, newPassword);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    isAuthenticated: user !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};