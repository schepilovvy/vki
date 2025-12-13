import type HomeworkInterface from '@/types/HomeworkInterface';

const getApiUrl = (): string => process.env.NEXT_PUBLIC_API || '/api/';

export const getHomeworksApi = async (): Promise<HomeworkInterface[]> => {
  try {
    const response = await fetch(`${getApiUrl()}homeworks`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    const homeworks = await response.json() as HomeworkInterface[];
    return homeworks;
  }
  catch (err) {
    console.log('>>> getHomeworksApi', err);
    return [] as HomeworkInterface[];
  }
};

export const getHomeworksByDisciplineApi = async (disciplineId: number): Promise<HomeworkInterface[]> => {
  try {
    const response = await fetch(`${getApiUrl()}homeworks/discipline/${disciplineId}`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    const homeworks = await response.json() as HomeworkInterface[];
    return homeworks;
  }
  catch (err) {
    console.log('>>> getHomeworksByDisciplineApi', err);
    return [] as HomeworkInterface[];
  }
};

export const deleteHomeworkApi = async (homeworkId: number): Promise<number> => {
  console.log('deleteHomeworkApi', homeworkId);
  debugger;
  try {
    const response = await fetch(`${getApiUrl()}homeworks/${homeworkId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    console.log('deleteHomeworkApi ok', homeworkId);
    debugger;

    return homeworkId;
  }
  catch (err) {
    console.log('>>> deleteHomeworkApi', err);
    return -1;
  }
};

export const addHomeworkApi = async (homework: HomeworkInterface): Promise<HomeworkInterface> => {
  console.log('addHomeworkApi');
  debugger;
  try {
    const response = await fetch(`${getApiUrl()}homeworks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(homework),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    console.log('addHomeworkApi ok');
    debugger;

    return response.json() as Promise<HomeworkInterface>;
  }
  catch (err) {
    console.log('>>> addHomeworkApi', err);
    throw err;
  }
};
