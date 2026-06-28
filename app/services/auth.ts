import * as SecureStore from 'expo-secure-store';
import { api } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  subscription_tier: 'free' | 'pro';
}

export async function register(name: string, email: string, password: string, password_confirmation: string) {
  const { data } = await api.post('/auth/register', { name, email, password, password_confirmation });
  await SecureStore.setItemAsync('auth_token', data.token);
  return data.user as User;
}

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  await SecureStore.setItemAsync('auth_token', data.token);
  return data.user as User;
}

export async function logout() {
  await api.post('/auth/logout');
  await SecureStore.deleteItemAsync('auth_token');
}

export async function getMe(): Promise<User | null> {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch {
    return null;
  }
}

export function getGoogleAuthUrl() {
  const base = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost/api';
  return `${base}/auth/google`;
}
