import { logger } from '@/lib/logger';
import { config } from '@/lib/config';

// 登录请求参数
export interface LoginRequest {
  clientId: string;
  authType: 'EMAIL_PASSWORD';
  email: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  code: number;
  msg: string;
  success: boolean;
  timestamp: number;
  data: {
    token: string;
  };
}

// 注册请求参数
export interface RegisterRequest {
  email: string;
  password: string;
  captcha: string;
}

// 注册响应
export interface RegisterResponse {
  code: number;
  msg: string;
  success: boolean;
  timestamp: number;
  data: boolean;
}

// 用户信息响应
export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  gender: number;
  email: string;
  phone: string;
  avatar: string;
  description: string;
  pwdResetTime: string;
  pwdExpired: boolean;
  registrationDate: string;
  deptId: number;
  deptName: string;
  permissions: string[];
  roles: string[];
  roleNames: string;
}

export interface UserInfoResponse {
  code: number;
  msg: string;
  success: boolean;
  timestamp: number;
  data: UserInfo;
}

// 发送验证码请求参数
export interface SendCaptchaRequest {
  email: string;
}

// 发送验证码响应
export interface SendCaptchaResponse {
  code: number;
  msg: string;
  success: boolean;
  timestamp: number;
  data: boolean;
}

// Google OAuth 响应
export interface GoogleOAuthResponse {
  code: number;
  msg: string;
  success: boolean;
  timestamp: number;
  data: {
    authorizeUrl: string;
  };
}

// OAuth2 授权响应
export interface OAuth2AuthorizeResponse {
  code: number;
  msg: string;
  success: boolean;
  timestamp: number;
  data: {
    code: string;
  } | null;
}

/**
 * 登录接口
 */
export async function login(params: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await fetch(`${config.api.authBaseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.msg || '登录失败');
    }

    logger.info('Login successful', { email: params.email });
    return data;
  } catch (error) {
    logger.error('Login failed', error as Error);
    throw error;
  }
}

/**
 * 注册接口
 */
export async function register(params: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${config.api.authBaseUrl}/api/register/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: RegisterResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.msg || '注册失败');
    }

    logger.info('Register successful', { email: params.email });
    return data;
  } catch (error) {
    logger.error('Register failed', error as Error);
    throw error;
  }
}

/**
 * 获取用户信息接口
 */
export async function getUserInfo(token: string): Promise<UserInfoResponse> {
  try {
    const response = await fetch(`${config.api.authBaseUrl}/auth/user/info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UserInfoResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.msg || '获取用户信息失败');
    }

    logger.info('Get user info successful', { userId: data.data.id });
    return data;
  } catch (error) {
    logger.error('Get user info failed', error as Error);
    throw error;
  }
}

/**
 * 发送验证码接口
 */
export async function sendCaptcha(params: SendCaptchaRequest): Promise<SendCaptchaResponse> {
  try {
    const queryParams = new URLSearchParams({
      email: params.email,
    });

    const response = await fetch(`${config.api.authBaseUrl}/api/captcha/mail?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SendCaptchaResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.msg || '发送验证码失败');
    }

    logger.info('Send captcha successful', { email: params.email });
    return data;
  } catch (error) {
    logger.error('Send captcha failed', error as Error);
    throw error;
  }
}

/**
 * Google OAuth 登录接口
 */
export async function getGoogleOAuthUrl(): Promise<GoogleOAuthResponse> {
  try {
    const response = await fetch(`${config.api.authBaseUrl}/oauth/google`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GoogleOAuthResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.msg || '获取 Google OAuth URL 失败');
    }

    logger.info('Get Google OAuth URL successful');
    return data;
  } catch (error) {
    logger.error('Get Google OAuth URL failed', error as Error);
    throw error;
  }
}

/**
 * OAuth2 授权接口
 */
export async function oauth2Authorize(token: string): Promise<OAuth2AuthorizeResponse> {
  try {
    const response = await fetch(`${config.api.authBaseUrl}/oauth2/authorize?clientId=portal-a`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OAuth2AuthorizeResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.msg || 'OAuth2 授权失败');
    }

    logger.info('OAuth2 authorize successful');
    return data;
  } catch (error) {
    logger.error('OAuth2 authorize failed', error as Error);
    throw error;
  }
}
