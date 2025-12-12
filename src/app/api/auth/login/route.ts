import { verifyUserDb } from '@/db/userDb';
import { generateToken } from '@/utils/jwt';
import { getStudentsDb } from '@/db/studentDb';
import { getTeachersDb } from '@/db/teacherDb';
import AppDataSource from '@/db/AppDataSource';
import { initializeDataSource } from '@/db/AppDataSource';

export async function POST(req: Request): Promise<Response> {
  try {
    // Убеждаемся, что БД инициализирована
    await initializeDataSource();
    
    const body = await req.json();
    let { login, password } = body;

    // Обрезаем пробелы в логине и пароле
    login = typeof login === 'string' ? login.trim() : login;
    password = typeof password === 'string' ? password.trim() : password;

    console.log('Login attempt:', { 
      login, 
      loginLength: login?.length,
      loginChars: JSON.stringify(login),
      hasPassword: !!password,
      passwordLength: password?.length,
      dbPath: AppDataSource.options.database,
      dbInitialized: AppDataSource.isInitialized
    });

    if (!login || !password) {
      return new Response(JSON.stringify({ error: 'Логин и пароль обязательны' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const user = await verifyUserDb(login, password);
    console.log('User verification result:', user ? 'success' : 'failed');
    if (!user) {
      console.log('Verification failed - checking if user exists by login');
      const { getUserByLoginDb } = await import('@/db/userDb');
      const userByLogin = await getUserByLoginDb(login);
      console.log('User by login exists:', !!userByLogin);
      if (userByLogin) {
        console.log('User found but password incorrect');
      }
    }

    if (!user) {
      return new Response(JSON.stringify({ error: 'Неверный логин или пароль' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Проверяем, что связанный студент/преподаватель существует
    if (user.role === 'student' && user.studentId) {
      const students = await getStudentsDb();
      const student = students.find(s => s.id === user.studentId && !s.isDeleted);
      if (!student) {
        console.error('Student not found for user:', { login, studentId: user.studentId });
        return new Response(JSON.stringify({ 
          error: `Студент с ID ${user.studentId} не найден в системе. Обратитесь к администратору.` 
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }
    else if (user.role === 'teacher' && user.teacherId) {
      const teachers = await getTeachersDb();
      const teacher = teachers.find(t => t.id === user.teacherId && !t.isDeleted);
      if (!teacher) {
        console.error('Teacher not found for user:', { login, teacherId: user.teacherId });
        return new Response(JSON.stringify({ 
          error: `Преподаватель с ID ${user.teacherId} не найден в системе. Обратитесь к администратору.` 
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }

    const token = generateToken(user);
    console.log('Token generated successfully');

    return new Response(JSON.stringify({ token, user }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in POST /api/auth/login:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при входе';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

