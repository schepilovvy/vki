import { getDisciplinesDb, addDisciplineDb } from '@/db/disciplineDb';
import { type NextRequest } from 'next/server';

export async function GET(): Promise<Response> {
  try {
    const disciplines = await getDisciplinesDb();

    return new Response(JSON.stringify(disciplines), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in GET /api/disciplines:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при получении дисциплин' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const discipline = await req.json();
    delete discipline['id'];
    const newDiscipline = await addDisciplineDb(discipline);

    console.log(newDiscipline);
    return new Response(JSON.stringify(newDiscipline), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in POST /api/disciplines:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при добавлении дисциплины';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
