import { deleteGroupDb, updateGroupDb } from '@/db/groupDb';
import { type NextRequest } from 'next/server';

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: Params): Promise<Response> {
  const p = await params;
  const groupId = parseInt((await p).id, 10);

  if (isNaN(groupId)) {
    return new Response(JSON.stringify({ error: 'Invalid group ID' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const deletedGroupId = await deleteGroupDb(groupId);

  return new Response(JSON.stringify({ deletedGroupId }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function PATCH(req: NextRequest, { params }: Params): Promise<Response> {
  const p = await params;
  const groupId = parseInt((await p).id, 10);

  if (isNaN(groupId)) {
    return new Response(JSON.stringify({ error: 'Invalid group ID' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const groupFields = await req.json();
  const updatedGroup = await updateGroupDb(groupId, groupFields);

  return new Response(JSON.stringify(updatedGroup), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
