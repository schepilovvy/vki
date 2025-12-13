import { deleteHomeworkDb } from '@/db/homeworkDb';
import { type NextRequest } from 'next/server';

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: Params): Promise<Response> {
  try {
    const p = await params;
    const homeworkId = parseInt((await p).id, 10);

    if (isNaN(homeworkId)) {
      return new Response(JSON.stringify({ error: 'Invalid homework ID' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const deletedHomeworkId = await deleteHomeworkDb(homeworkId);

    return new Response(JSON.stringify({ deletedHomeworkId }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in DELETE /api/homeworks/[id]:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при удалении домашнего задания' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
