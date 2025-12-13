import { deleteStudentDb } from '@/db/studentDb';
import { type NextRequest } from 'next/server';

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: Params): Promise<Response> {
  const p = await params;
  const studentId = parseInt(p.id, 10);

  if (isNaN(studentId)) {
    return new Response(JSON.stringify({ error: 'Invalid student ID' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const deletedStudentId = await deleteStudentDb(studentId);

  return new Response(JSON.stringify({ deletedStudentId }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
