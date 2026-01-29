/**
 * API 请求工具
 * 统一处理 API 请求配置，包括 Authorization 头
 */

import { getToken } from './auth-storage';

/**
 * 创建带认证头的请求配置
 * @param options 请求配置选项
 * @returns Fetch RequestInit 配置
 */
export function createAuthHeaders(options: {
  method?: string;
  body?: string | FormData;
  contentType?: string;
  needAuth?: boolean;
} = {}): RequestInit {
  const { method = 'GET', body, contentType = 'application/json', needAuth = true } = options;

  const headers: Record<string, string> = {};

  // 设置 Content-Type
  if (contentType && !(body instanceof FormData)) {
    headers['Content-Type'] = contentType;
  }

  // 添加 Authorization 头
  if (needAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = body;
  }

  return config;
}
