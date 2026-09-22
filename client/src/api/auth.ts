import { api } from './client';
import type { User } from '../lib/types';

export function register(name: string, email: string, password: string) {
  return api<{ user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function login(email: string, password: string) {
  return api<{ user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function fetchMe() {
  return api<{ user: User }>('/auth/me');
}

export function logout() {
  return api<void>('/auth/logout', { method: 'POST' });
}
