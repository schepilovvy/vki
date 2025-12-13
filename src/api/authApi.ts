import type UserInterface from '@/types/UserInterface';
import type { JWTPayload } from '@/utils/jwt';

const getApiUrl = (): string => process.env.NEXT_PUBLIC_API || '/api/';

export interface LoginResponse {
  token: string;
  user: UserInterface;
}

export const loginApi = async (login: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${getApiUrl()}auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Ошибка при входе');
    }

    return response.json() as Promise<LoginResponse>;
  }
  catch (err) {
    console.log('>>> loginApi', err);
    throw err;
  }
};

export const getCurrentUserApi = async (): Promise<JWTPayload | null> => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    const response = await fetch(`${getApiUrl()}auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Если токен невалидный, удаляем его
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      return null;
    }

    return response.json() as Promise<JWTPayload>;
  }
  catch (err) {
    console.log('>>> getCurrentUserApi', err);
    return null;
  }
};

export const logoutApi = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
