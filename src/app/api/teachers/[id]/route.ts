import { deleteTeacherDb } from '@/db/teacherDb';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const teacherId = parseInt(id, 10);

  if (isNaN(teacherId)) {
    return new Response(JSON.stringify({ error: 'Invalid teacher ID' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  await deleteTeacherDb(teacherId);

  return new Response(JSON.stringify({ id: teacherId }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
