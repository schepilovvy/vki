import { getGroupsDb, addGroupsDb } from '@/db/groupDb';
import { type NextApiRequest } from 'next/types';

export async function GET(): Promise<Response> {
  try {
    const groups = await getGroupsDb();
 
    return new Response(JSON.stringify(groups), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in GET /api/groups:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при получении групп' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export async function POST(req: NextApiRequest): Promise<Response> {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const group = await req.json();
    delete group['id'];
    const newGroup = await addGroupsDb(group);

    console.log(newGroup);
    return new Response(JSON.stringify(newGroup), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in POST /api/groups:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при добавлении группы';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
