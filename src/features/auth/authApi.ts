import { apiClient } from '@/services/apiClient';
import type { User } from '@/types/api';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterResponse {
  user: User;
}

interface LoginResponse {
  token: string;
}

interface AuthedUserResponse {
  user: User;
}

export function registerUser(payload: RegisterPayload) {
  return apiClient<RegisterResponse>('/register', {
    body: payload,
    method: 'POST',
  });
}

export function loginUser(payload: LoginPayload) {
  return apiClient<LoginResponse>('/login', {
    body: payload,
    method: 'POST',
  });
}

export function getAuthedUser() {
  return apiClient<AuthedUserResponse>('/users/me');
}
