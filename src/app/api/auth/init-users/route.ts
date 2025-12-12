import { createUserDb } from '@/db/userDb';
import { UserRole } from '@/db/entity/User.entity';

/**
 * Инициализация тестовых пользователей
 * Этот endpoint создает тестовых пользователей для разных ролей
 */
export async function GET(): Promise<Response> {
  try {
    const users = [
      { login: 'admin', password: 'admin123', role: UserRole.ADMIN },
      { login: 'teacher1', password: 'teacher123', role: UserRole.TEACHER, teacherId: 1 },
      { login: 'student1', password: 'student123', role: UserRole.STUDENT, studentId: 1 },
    ];

    const createdUsers = [];

    for (const user of users) {
      try {
        const newUser = await createUserDb(
          user.login,
          user.password,
          user.role,
          user.studentId,
          user.teacherId,
        );
        createdUsers.push(newUser);
      }
      catch (error) {
        // Игнорируем ошибку, если пользователь уже существует
        if (error instanceof Error && error.message.includes('уже существует')) {
          console.log(`Пользователь ${user.login} уже существует`);
        }
        else {
          throw error;
        }
      }
    }

    return new Response(JSON.stringify({
      message: 'Пользователи инициализированы',
      users: createdUsers,
      testUsers: [
        { login: 'admin', password: 'admin123', role: 'admin' },
        { login: 'teacher1', password: 'teacher123', role: 'teacher' },
        { login: 'student1', password: 'student123', role: 'student' },
      ],
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in GET /api/auth/init-users:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при инициализации пользователей' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}


