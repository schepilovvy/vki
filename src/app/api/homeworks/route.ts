import { getHomeworksDb, addHomeworkDb } from '@/db/homeworkDb';
import { type NextRequest } from 'next/server';

export async function GET(): Promise<Response> {
  try {
    const homeworks = await getHomeworksDb();

    return new Response(JSON.stringify(homeworks), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in GET /api/homeworks:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при получении домашних заданий' }), {
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
    const homework = await req.json();
    delete homework['id'];
    const newHomework = await addHomeworkDb(homework);

    console.log(newHomework);
    return new Response(JSON.stringify(newHomework), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in POST /api/homeworks:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при добавлении домашнего задания';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
