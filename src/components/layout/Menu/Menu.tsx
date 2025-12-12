'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import styles from './Menu.module.scss';

const Menu = (): React.ReactElement => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = (): void => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return (
      <nav className={styles.Menu}>
        <div className={pathname === '/login' ? styles.linkActive : ''}>
          <Link href="/login">Вход</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className={styles.Menu}>
      {user?.role === 'admin' && (
        <>
          <div className={pathname === '/groups' ? styles.linkActive : ''}>
            <Link href="/groups">Группы</Link>
          </div>
          <div className={pathname === '/students' ? styles.linkActive : ''}>
            <Link href="/students">Студенты</Link>
          </div>
          <div className={pathname === '/teachers' ? styles.linkActive : ''}>
            <Link href="/teachers">Преподаватели</Link>
          </div>
          <div className={pathname === '/disciplines' ? styles.linkActive : ''}>
            <Link href="/disciplines">Дисциплины</Link>
          </div>
          <div className={pathname === '/search' ? styles.linkActive : ''}>
            <Link href="/search">Поиск</Link>
          </div>
        </>
      )}
      {user?.role === 'teacher' && (
        <>
          <div className={pathname === '/teacher/curatorship' ? styles.linkActive : ''}>
            <Link href="/teacher/curatorship">Кураторство</Link>
          </div>
          <div className={pathname === '/teacher/disciplines' ? styles.linkActive : ''}>
            <Link href="/teacher/disciplines">Мои дисциплины</Link>
          </div>
        </>
      )}
      {user?.role === 'student' && (
        <>
          <div className={pathname === '/student/group' ? styles.linkActive : ''}>
            <Link href="/student/group">Моя группа</Link>
          </div>
          <div className={pathname === '/student/disciplines' ? styles.linkActive : ''}>
            <Link href="/student/disciplines">Мои дисциплины</Link>
          </div>
          <div className={pathname === '/student/grades' ? styles.linkActive : ''}>
            <Link href="/student/grades">Мои оценки</Link>
          </div>
        </>
      )}
      <div className={styles.logoutButton}>
        <button onClick={handleLogout}>Выход ({user?.login})</button>
      </div>
    </nav>
  );
};

export default Menu;
