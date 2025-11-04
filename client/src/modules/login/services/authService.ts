import type { LoginCredentials, AuthResponse } from '../types/auth.types';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    const { token, user } = response.data;
    localStorage.setItem('authToken', token);
    return { token, user };
  },

  logout() {
    localStorage.removeItem('authToken');
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  setToken(token: string) {
    localStorage.setItem('authToken', token);
  },
};
