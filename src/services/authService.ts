import { API_BASE_URL } from '../api/config';
import type { User } from '../types/User';

interface LoginResponse {
  user: User;
  token: string;
}

const AUTH_API_URL = `${API_BASE_URL}/auth`;

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || 'Error en el login';
      throw new Error(message);
    }

    const data = await response.json();

    // Aquí asumimos que tu API devuelve { user, token }
    return {
      user: data.user,
      token: data.token,
    };
  },

  register: async (userData: FormData): Promise<LoginResponse> => {
    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: 'POST',
      body: userData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || 'Error en el registro';
      throw new Error(message);
    }

    const data = await response.json();

    return {
      user: data.user,
      token: data.token,
    };
  },

  // Aquí puedes añadir logout, forgot password, etc. según tu API

  getCurrentUser: async () => {
    const response = await fetch(`${AUTH_API_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || 'Error al obtener usuario actual';
      throw new Error(message);
    }

    const data = await response.json();
    return { user: data.user };
  },

  forgotPassword: async (email: string): Promise<{ msg: string }> => {
    const response = await fetch(`${AUTH_API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Error en el servidor');
    return data;
  },

  resetPassword: async (token: string, password: string): Promise<{ msg: string }> => {
    const response = await fetch(`${AUTH_API_URL}/reset-password/${token}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Error en el servidor');
    return data;
  },
};
