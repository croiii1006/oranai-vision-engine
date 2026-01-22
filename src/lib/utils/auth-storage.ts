/**
 * 认证相关的存储工具
 * 管理 token 和用户信息的存储
 */

import { storage } from './storage';
import { STORAGE_KEYS } from '../constants';
import type { UserInfo } from '../api/auth';

/**
 * 保存认证 token
 */
export function saveToken(token: string): boolean {
  return storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
}

/**
 * 获取认证 token
 */
export function getToken(): string | null {
  return storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * 删除认证 token
 */
export function removeToken(): boolean {
  return storage.remove(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * 保存用户信息
 */
export function saveUserInfo(userInfo: UserInfo): boolean {
  return storage.set(STORAGE_KEYS.USER_INFO, userInfo);
}

/**
 * 获取用户信息
 */
export function getUserInfo(): UserInfo | null {
  return storage.get<UserInfo>(STORAGE_KEYS.USER_INFO);
}

/**
 * 删除用户信息
 */
export function removeUserInfo(): boolean {
  return storage.remove(STORAGE_KEYS.USER_INFO);
}

/**
 * 保存 OAuth code
 */
export function saveOAuthCode(code: string): boolean {
  return storage.set(STORAGE_KEYS.OAUTH_CODE, code);
}

/**
 * 获取 OAuth code
 */
export function getOAuthCode(): string | null {
  return storage.get<string>(STORAGE_KEYS.OAUTH_CODE);
}

/**
 * 删除 OAuth code
 */
export function removeOAuthCode(): boolean {
  return storage.remove(STORAGE_KEYS.OAUTH_CODE);
}

/**
 * 清除所有认证相关数据
 */
export function clearAuth(): void {
  removeToken();
  removeUserInfo();
  removeOAuthCode();
}

/**
 * 检查是否已登录
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}
