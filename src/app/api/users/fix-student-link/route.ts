import { getUserByLoginDb } from '@/db/userDb';
import { getStudentsDb } from '@/db/studentDb';
import AppDataSource, { initializeDataSource } from '@/db/AppDataSource';
import { User } from '@/db/entity/User.entity';

/**
 * API для исправления связи между пользователем и студентом
 * Используется когда студент существует, но связь неверна
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { login, studentId } = body;

    if (!login || !studentId) {
      return new Response(JSON.stringify({ error: 'login и studentId обязательны' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Проверяем, существует ли студент
    const students = await getStudentsDb();
    const student = students.find(s => s.id === studentId && !s.isDeleted);

    if (!student) {
      return new Response(JSON.stringify({ error: 'Студент с таким ID не найден' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Обновляем связь в таблице User
    const user = await getUserByLoginDb(login);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Пользователь с таким логином не найден' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!AppDataSource.isInitialized) {
      await initializeDataSource();
    }
    const userRepository = AppDataSource.getRepository(User);

    user.studentId = studentId;
    await userRepository.save(user);

    return new Response(JSON.stringify({
      message: 'Связь успешно обновлена',
      user: {
        id: user.id,
        login: user.login,
        role: user.role,
        studentId: user.studentId,
        teacherId: user.teacherId,
      },
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in POST /api/users/fix-student-link:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при обновлении связи';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
