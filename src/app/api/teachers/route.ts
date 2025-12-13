import { getTeachersDb, addTeacherDb } from '@/db/teacherDb';
import { initializeDataSource } from '@/db/AppDataSource';
import AppDataSource from '@/db/AppDataSource';

export async function GET(): Promise<Response> {
  try {
    await initializeDataSource();
    console.log('GET /api/teachers: Starting...');
    console.log('GET /api/teachers: DB path:', AppDataSource.options.database);
    console.log('GET /api/teachers: DB initialized:', AppDataSource.isInitialized);
    const teachers = await getTeachersDb();
    console.log(`GET /api/teachers: Returning ${teachers.length} teachers`);
    if (teachers.length > 0) {
      console.log('GET /api/teachers: First teacher:', JSON.stringify(teachers[0]));
    }

    return new Response(JSON.stringify(teachers), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in GET /api/teachers:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при получении преподавателей' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    await initializeDataSource();
    const body = await req.json();
    const { password, ...teacher } = body;
    delete teacher['id'];

    if (!password) {
      return new Response(JSON.stringify({ error: 'Пароль обязателен' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const newTeacher = await addTeacherDb(teacher, password);

    console.log(newTeacher);
    return new Response(JSON.stringify(newTeacher), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in POST /api/teachers:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при добавлении преподавателя';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
