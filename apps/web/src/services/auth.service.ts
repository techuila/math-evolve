import { api } from './api';
import type { AdminUser, AuthResponse, LoginCredentials } from '@mathevolve/types';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export async function login(
  credentials: LoginCredentials
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const response = await api.post<AuthResponse>('/auth/login', credentials);

  if (response.success && response.data) {
    localStorage.setItem(TOKEN_KEY, response.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    return { success: true, user: response.data.user };
  }

  return {
    success: false,
    error: response.error?.message || 'Login failed',
  };
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AdminUser | null {
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;

  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function verifyToken(): Promise<{
  valid: boolean;
  user?: AdminUser;
}> {
  const token = getToken();
  if (!token) return { valid: false };

  const response = await api.post<{ valid: boolean }>('/auth/verify', {});

  if (!response.success || !response.data?.valid) {
    logout();
    return { valid: false };
  }

  const user = getStoredUser();
  return { valid: true, user: user || undefined };
}

export async function getCurrentUser(): Promise<AdminUser | null> {
  const response = await api.get<{ user: AdminUser }>('/auth/me');

  if (response.success && response.data) {
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    return response.data.user;
  }

  return null;
}
