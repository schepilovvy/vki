import { getTeachersDb, addTeacherDb } from '@/db/teacherDb';

export async function GET(): Promise<Response> {
  try {
    const teachers = await getTeachersDb();

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
