import apiClient from './api';
import type { AuthResponse, User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  saveAuth: (authResponse: AuthResponse) => {
    localStorage.setItem('access_token', authResponse.access_token);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
  },
};

