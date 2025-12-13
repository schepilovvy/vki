import { getStudentsDb, addStudentDb } from '@/db/studentDb';
import { initializeDataSource } from '@/db/AppDataSource';
import AppDataSource from '@/db/AppDataSource';

export async function GET(): Promise<Response> {
  try {
    await initializeDataSource();
    console.log('GET /api/students: Starting...');
    console.log('GET /api/students: DB path:', AppDataSource.options.database);
    console.log('GET /api/students: DB initialized:', AppDataSource.isInitialized);
    const students = await getStudentsDb();
    console.log(`GET /api/students: Returning ${students.length} students`);
    if (students.length > 0) {
      console.log('GET /api/students: First student:', JSON.stringify(students[0]));
    }

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
    await initializeDataSource();
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
