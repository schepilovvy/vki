import { getGroupsDb, addGroupsDb } from '@/db/groupDb';
import { initializeDataSource } from '@/db/AppDataSource';
import AppDataSource from '@/db/AppDataSource';
import { type NextRequest } from 'next/server';

export async function GET(): Promise<Response> {
  try {
    await initializeDataSource();
    console.log('GET /api/groups: Starting...');
    console.log('GET /api/groups: DB path:', AppDataSource.options.database);
    console.log('GET /api/groups: DB initialized:', AppDataSource.isInitialized);
    const groups = await getGroupsDb();
    console.log(`GET /api/groups: Returning ${groups.length} groups`);
    if (groups.length > 0) {
      console.log('GET /api/groups: First group:', JSON.stringify(groups[0]));
    }

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

export async function POST(req: NextRequest): Promise<Response> {
  try {
    await initializeDataSource();
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
