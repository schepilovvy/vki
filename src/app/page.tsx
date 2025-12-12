'use client';

import Page from '@/components/layout/Page/Page';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const HomePage = (): React.ReactNode => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Перенаправляем в зависимости от роли
      if (user.role === 'student') {
        router.push('/student/group');
      }
      else if (user.role === 'teacher') {
        router.push('/teacher/curatorship');
      }
      // Администратор остается на главной странице
    }
    else if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <Page>
        <p>Загрузка...</p>
      </Page>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (user?.role === 'admin') {
    return (
      <Page>
        <h1>Добро пожаловать, администратор!</h1>
        <p>Используйте меню для навигации по разделам системы.</p>
      </Page>
    );
  }

  return (
    <Page>
      <p>Перенаправление...</p>
    </Page>
  );
};

export default HomePage;
