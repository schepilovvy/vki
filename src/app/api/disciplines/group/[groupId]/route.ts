import { getDisciplinesByGroupDb } from '@/db/disciplineDb';

interface Params {
  params: Promise<{ groupId: string }>;
}

export async function GET(req: Request, { params }: Params): Promise<Response> {
  try {
    const p = await params;
    const groupId = parseInt((await p).groupId, 10);

    if (isNaN(groupId)) {
      return new Response(JSON.stringify({ error: 'Invalid group ID' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const disciplines = await getDisciplinesByGroupDb(groupId);

    return new Response(JSON.stringify(disciplines), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in GET /api/disciplines/group/[groupId]:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при получении дисциплин' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}


