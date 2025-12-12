import { searchStudentsDb } from '@/db/studentDb';
import { searchTeachersDb } from '@/db/teacherDb';
import { searchGroupsDb } from '@/db/groupDb';
import { searchDisciplinesDb } from '@/db/disciplineDb';

type SearchType = 'student' | 'teacher' | 'group' | 'discipline';

export async function GET(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as SearchType | null;
    const query = searchParams.get('query') || '';

    if (!type) {
      return new Response(JSON.stringify({ error: 'Тип поиска не указан' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!query.trim()) {
      return new Response(JSON.stringify([]), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    let results;

    switch (type) {
      case 'student':
        results = await searchStudentsDb(query);
        break;
      case 'teacher':
        results = await searchTeachersDb(query);
        break;
      case 'group':
        results = await searchGroupsDb(query);
        break;
      case 'discipline':
        results = await searchDisciplinesDb(query);
        break;
      default:
        return new Response(JSON.stringify({ error: 'Неизвестный тип поиска' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
    }

    return new Response(JSON.stringify(results), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in GET /api/search:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при выполнении поиска' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

