'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import styles from './Login.module.scss';

const Login = (): React.ReactElement => {
  const router = useRouter();
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === 'student') {
        router.push('/student/group');
      }
      else if (user.role === 'teacher') {
        router.push('/teacher/curatorship');
      }
      else if (user.role === 'admin') {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    try {
      console.log('Attempting login with:', formData.login);
      await login(formData.login, formData.password);
      
      // Небольшая задержка для обновления состояния
      setTimeout(() => {
        // Получаем роль пользователя из localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          console.log('User role:', user.role);
          // Перенаправляем в зависимости от роли
          if (user.role === 'admin') {
            router.push('/');
          }
          else if (user.role === 'teacher') {
            router.push('/teacher/curatorship');
          }
          else if (user.role === 'student') {
            router.push('/student/group');
          }
          else {
            router.push('/');
          }
        }
        else {
          router.push('/');
        }
      }, 100);
    }
    catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при входе');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.Login}>
        <div className={styles.loginCard}>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className={styles.Login}>
        <div className={styles.loginCard}>
          <p>Перенаправление...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Login}>
      <div className={styles.loginCard}>
        <h1>Вход в систему</h1>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="login">Логин</label>
            <input
              id="login"
              type="text"
              value={formData.login}
              onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" disabled={isLoading} className={styles.submitButton}>
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

