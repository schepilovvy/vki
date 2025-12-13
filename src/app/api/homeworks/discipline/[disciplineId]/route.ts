import { getHomeworksByDisciplineDb } from '@/db/homeworkDb';

interface Params {
  params: Promise<{ disciplineId: string }>;
}

export async function GET(req: Request, { params }: Params): Promise<Response> {
  try {
    const p = await params;
    const disciplineId = parseInt((await p).disciplineId, 10);

    if (isNaN(disciplineId)) {
      return new Response(JSON.stringify({ error: 'Invalid discipline ID' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const homeworks = await getHomeworksByDisciplineDb(disciplineId);

    return new Response(JSON.stringify(homeworks), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in GET /api/homeworks/discipline/[disciplineId]:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при получении домашних заданий' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
