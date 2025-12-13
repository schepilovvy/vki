import { deleteAllStudentsDb } from '@/db/studentDb';

/**
 * API для полной очистки всех студентов
 * ВНИМАНИЕ: Это удалит всех студентов и связанных пользователей!
 */
export async function DELETE(): Promise<Response> {
  try {
    const deletedCount = await deleteAllStudentsDb();

    return new Response(JSON.stringify({
      message: 'Все студенты успешно удалены',
      deletedCount,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in DELETE /api/students/clear:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при удалении студентов';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
