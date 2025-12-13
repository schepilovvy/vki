import type GradeInterface from '@/types/GradeInterface';

const getApiUrl = (): string => process.env.NEXT_PUBLIC_API || '/api/';

export const getGradesByDisciplineApi = async (disciplineId: number): Promise<GradeInterface[]> => {
  try {
    const response = await fetch(`${getApiUrl()}grades?disciplineId=${disciplineId}`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    const grades = await response.json() as GradeInterface[];
    return grades;
  }
  catch (err) {
    console.log('>>> getGradesByDisciplineApi', err);
    return [] as GradeInterface[];
  }
};

export const getGradesByStudentApi = async (studentId: number): Promise<GradeInterface[]> => {
  try {
    const response = await fetch(`${getApiUrl()}grades?studentId=${studentId}`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    const grades = await response.json() as GradeInterface[];
    return grades;
  }
  catch (err) {
    console.log('>>> getGradesByStudentApi', err);
    return [] as GradeInterface[];
  }
};

export const deleteGradeApi = async (gradeId: number): Promise<number> => {
  console.log('deleteGradeApi', gradeId);
  debugger;
  try {
    const response = await fetch(`${getApiUrl()}grades/${gradeId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    console.log('deleteGradeApi ok', gradeId);
    debugger;

    return gradeId;
  }
  catch (err) {
    console.log('>>> deleteGradeApi', err);
    return -1;
  }
};

export const addGradeApi = async (grade: GradeInterface): Promise<GradeInterface> => {
  console.log('addGradeApi');
  debugger;
  try {
    const response = await fetch(`${getApiUrl()}grades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grade),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    console.log('addGradeApi ok');
    debugger;

    return response.json() as Promise<GradeInterface>;
  }
  catch (err) {
    console.log('>>> addGradeApi', err);
    throw err;
  }
};
