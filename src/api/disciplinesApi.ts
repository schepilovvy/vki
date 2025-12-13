import type DisciplineInterface from '@/types/DisciplineInterface';

const getApiUrl = (): string => process.env.NEXT_PUBLIC_API || '/api/';

export const getDisciplinesApi = async (): Promise<DisciplineInterface[]> => {
  try {
    const response = await fetch(`${getApiUrl()}disciplines`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    const disciplines = await response.json() as DisciplineInterface[];
    return disciplines;
  }
  catch (err) {
    console.log('>>> getDisciplinesApi', err);
    return [] as DisciplineInterface[];
  }
};

export const getDisciplinesByGroupApi = async (groupId: number): Promise<DisciplineInterface[]> => {
  try {
    const response = await fetch(`${getApiUrl()}disciplines/group/${groupId}`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    const disciplines = await response.json() as DisciplineInterface[];
    return disciplines;
  }
  catch (err) {
    console.log('>>> getDisciplinesByGroupApi', err);
    return [] as DisciplineInterface[];
  }
};

export const deleteDisciplineApi = async (disciplineId: number): Promise<number> => {
  console.log('deleteDisciplineApi', disciplineId);
  debugger;
  try {
    const response = await fetch(`${getApiUrl()}disciplines/${disciplineId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    console.log('deleteDisciplineApi ok', disciplineId);
    debugger;

    return disciplineId;
  }
  catch (err) {
    console.log('>>> deleteDisciplineApi', err);
    return -1;
  }
};

export const addDisciplineApi = async (discipline: DisciplineInterface): Promise<DisciplineInterface> => {
  console.log('addDisciplineApi');
  debugger;
  try {
    const response = await fetch(`${getApiUrl()}disciplines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discipline),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    console.log('addDisciplineApi ok');
    debugger;

    return response.json() as Promise<DisciplineInterface>;
  }
  catch (err) {
    console.log('>>> addDisciplineApi', err);
    throw err;
  }
};
