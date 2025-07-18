import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5720';

console.log('🌐 API: Base URL configured as:', API_BASE_URL);
console.log('🌐 API: Environment variable REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('✅ API: Axios instance created with baseURL:', API_BASE_URL);

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log('🌐 API: Making request to:', (config.baseURL || '') + (config.url || ''));
    console.log('🔗 API: Request method:', config.method?.toUpperCase());
    console.log('📦 API: Request data:', config.data);
    
    // 添加认证token
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 API: Token added to request');
    } else {
      console.log('⚠️ API: No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('❌ API: Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log('✅ API: Response received');
    console.log('🔍 API: Response status:', response.status);
    console.log('🔍 API: Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API: Response error');
    console.error('🔍 API: Error status:', error.response?.status);
    console.error('🔍 API: Error data:', error.response?.data);
    console.error('🔍 API: Error message:', error.message);
    
    // 将错误信息存储到sessionStorage以便调试
    sessionStorage.setItem('debug_api_error', JSON.stringify({
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      timestamp: new Date().toISOString()
    }));
    
    // 统一错误处理
    if (error.response?.status === 401) {
      console.log('🔐 API: 401 Unauthorized - clearing token and redirecting');
      sessionStorage.setItem('debug_401_redirect', JSON.stringify({
        from: window.location.pathname,
        timestamp: new Date().toISOString()
      }));
      localStorage.removeItem('access_token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;