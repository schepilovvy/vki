import { User, type UserRole } from './entity/User.entity';
import type UserInterface from '@/types/UserInterface';
import AppDataSource, { initializeDataSource } from './AppDataSource';
import bcrypt from 'bcryptjs';
import type { Repository } from 'typeorm';

/**
 * Получение репозитория пользователей с проверкой соединения
 */
const getUserRepository = async (): Promise<Repository<User>> => {
  if (!AppDataSource.isInitialized) {
    await initializeDataSource();
  }
  const repo = AppDataSource.getRepository(User);
  // Логируем для отладки
  if (process.env.NODE_ENV === 'development') {
    console.log('User repository initialized, DB path:', AppDataSource.options.database);
  }
  return repo;
};

/**
 * Получение пользователя по логину
 * @param login Логин пользователя
 * @returns Promise<User | null>
 */
export const getUserByLoginDb = async (login: string): Promise<User | null> => {
  const userRepository = await getUserRepository();
  // Обрезаем пробелы для надежности
  const trimmedLogin = login.trim();
  // Пытаемся найти по обрезанному логину
  let user = await userRepository.findOne({ where: { login: trimmedLogin } });
  // Если не нашли, пробуем найти по оригинальному логину (на случай, если в БД есть пробелы)
  if (!user) {
    user = await userRepository.findOne({ where: { login } });
  }
  return user;
};

/**
 * Создание пользователя
 * @param login Логин
 * @param password Пароль (будет захеширован)
 * @param role Роль пользователя
 * @param studentId ID студента (опционально)
 * @param teacherId ID преподавателя (опционально)
 * @returns Promise<UserInterface>
 */
export const createUserDb = async (
  login: string,
  password: string,
  role: UserRole,
  studentId?: number,
  teacherId?: number,
): Promise<UserInterface> => {
  const userRepository = await getUserRepository();

  // Проверяем, существует ли пользователь с таким логином
  const existingUser = await getUserByLoginDb(login);
  if (existingUser) {
    throw new Error('Пользователь с таким логином уже существует');
  }

  // Хешируем пароль
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User();
  const newUser = await userRepository.save({
    ...user,
    login,
    password: hashedPassword,
    role,
    studentId,
    teacherId,
  });

  return {
    id: newUser.id,
    login: newUser.login,
    role: newUser.role,
    studentId: newUser.studentId,
    teacherId: newUser.teacherId,
  };
};

/**
 * Проверка пароля пользователя
 * @param login Логин
 * @param password Пароль
 * @returns Promise<UserInterface | null>
 */
export const verifyUserDb = async (login: string, password: string): Promise<UserInterface | null> => {
  // Обрезаем пробелы для надежности
  const trimmedLogin = login.trim();
  const trimmedPassword = password.trim();

  const user = await getUserByLoginDb(trimmedLogin);
  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(trimmedPassword, user.password);
  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    login: user.login,
    role: user.role,
    studentId: user.studentId,
    teacherId: user.teacherId,
  };
};
