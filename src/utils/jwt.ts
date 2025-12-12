import jwt from 'jsonwebtoken';
import type UserInterface from '@/types/UserInterface';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: number;
  login: string;
  role: string;
  studentId?: number;
  teacherId?: number;
}

/**
 * Генерация JWT токена
 */
export const generateToken = (user: UserInterface): string => {
  const payload: JWTPayload = {
    userId: user.id,
    login: user.login,
    role: user.role,
    studentId: user.studentId,
    teacherId: user.teacherId,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Верификация JWT токена
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  }
  catch (error) {
    return null;
  }
};

/**
 * Извлечение токена из заголовка Authorization
 */
export const extractTokenFromHeader = (authHeader: string | null): string | null => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};


