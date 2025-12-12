import { getGradesByDisciplineDb, addGradeDb, getGradesByStudentDb } from '@/db/gradeDb';
import { type NextApiRequest } from 'next/types';

export async function GET(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const disciplineId = searchParams.get('disciplineId');
    const studentId = searchParams.get('studentId');

    // Если указан studentId, возвращаем все оценки студента
    if (studentId) {
      const studentIdNum = parseInt(studentId, 10);
      if (isNaN(studentIdNum)) {
        return new Response(JSON.stringify({ error: 'Invalid studentId' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      const grades = await getGradesByStudentDb(studentIdNum);
      return new Response(JSON.stringify(grades), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Если указан disciplineId, возвращаем оценки по дисциплине
    if (!disciplineId) {
      return new Response(JSON.stringify({ error: 'disciplineId or studentId is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const disciplineIdNum = parseInt(disciplineId, 10);
    if (isNaN(disciplineIdNum)) {
      return new Response(JSON.stringify({ error: 'Invalid disciplineId' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const grades = await getGradesByDisciplineDb(disciplineIdNum);

    return new Response(JSON.stringify(grades), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in GET /api/grades:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при получении оценок' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(req: NextApiRequest): Promise<Response> {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const grade = await req.json();
    delete grade['id'];
    const newGrade = await addGradeDb(grade);

    console.log(newGrade);
    return new Response(JSON.stringify(newGrade), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in POST /api/grades:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при добавлении оценки';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

