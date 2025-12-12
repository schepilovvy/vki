import type GroupInterface from '@/types/GroupInterface';

export const getGroupsApi = async (): Promise<GroupInterface[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}groups`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    const groups = await response.json() as GroupInterface[];
    return groups;
  }
  catch (err) {
    console.log('>>> getGroupsApi', err);
    return [] as GroupInterface[];
  }
};

export const addGroupApi = async (group: GroupInterface): Promise<GroupInterface> => {
  console.log('addGroupApi');
  debugger;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(group),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    console.log('addGroupApi ok');
    debugger;

    return response.json() as Promise<GroupInterface>;
  }
  catch (err) {
    console.log('>>> addGroupApi', err);
    throw err;
  }
};

export const deleteGroupApi = async (groupId: number): Promise<number> => {
  console.log('deleteGroupApi', groupId);
  debugger;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}groups/${groupId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    console.log('deleteGroupApi ok', groupId);
    debugger;

    return groupId;
  }
  catch (err) {
    console.log('>>> deleteGroupApi', err);
    return -1;
  }
};

export const updateGroupApi = async (groupId: number, groupFields: Partial<Omit<GroupInterface, 'id'>>): Promise<GroupInterface> => {
  console.log('updateGroupApi', groupId, groupFields);
  debugger;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}groups/${groupId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(groupFields),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    console.log('updateGroupApi ok');
    debugger;

    return response.json() as Promise<GroupInterface>;
  }
  catch (err) {
    console.log('>>> updateGroupApi', err);
    throw err;
  }
};