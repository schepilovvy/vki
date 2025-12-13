import { deleteGradeDb } from '@/db/gradeDb';
import { type NextRequest } from 'next/server';

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: Params): Promise<Response> {
  try {
    const p = await params;
    const gradeId = parseInt((await p).id, 10);

    if (isNaN(gradeId)) {
      return new Response(JSON.stringify({ error: 'Invalid grade ID' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const deletedGradeId = await deleteGradeDb(gradeId);

    return new Response(JSON.stringify({ deletedGradeId }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in DELETE /api/grades/[id]:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при удалении оценки' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
