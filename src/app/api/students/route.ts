import { getStudentsDb, addStudentDb } from '@/db/studentDb';

export async function GET(): Promise<Response> {
  try {
    const students = await getStudentsDb();

    return new Response(JSON.stringify(students), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in GET /api/students:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при получении студентов' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { password, ...student } = body;
    delete student['id'];

    if (!password) {
      return new Response(JSON.stringify({ error: 'Пароль обязателен' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const newStudent = await addStudentDb(student, password);

    console.log(newStudent);
    return new Response(JSON.stringify(newStudent), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in POST /api/students:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при добавлении студента';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
