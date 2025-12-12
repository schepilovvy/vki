import { deleteDisciplineDb } from '@/db/disciplineDb';
import { type NextApiRequest } from 'next/types';

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextApiRequest, { params }: Params): Promise<Response> {
  try {
    const p = await params;
    const disciplineId = parseInt((await p).id, 10);

    if (isNaN(disciplineId)) {
      return new Response(JSON.stringify({ error: 'Invalid discipline ID' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const deletedDisciplineId = await deleteDisciplineDb(disciplineId);

    return new Response(JSON.stringify({ deletedDisciplineId }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in DELETE /api/disciplines/[id]:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при удалении дисциплины' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}


