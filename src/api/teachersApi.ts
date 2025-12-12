import type TeacherInterface from '@/types/TeacherInterface';

export const getTeachersApi = async (): Promise<TeacherInterface[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}teachers`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    const teachers = await response.json() as TeacherInterface[];
    return teachers;
  }
  catch (err) {
    console.log('>>> getTeachersApi', err);
    return [] as TeacherInterface[];
  }
};

export const deleteTeacherApi = async (teacherId: number): Promise<number> => {
  console.log('deleteTeacherApi', teacherId);
  debugger;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}teachers/${teacherId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    console.log('deleteTeacherApi ok', teacherId);
    debugger;

    return teacherId;
  }
  catch (err) {
    console.log('>>> deleteTeacherApi', err);
    return -1;
  }
};

export const addTeacherApi = async (teacher: TeacherInterface & { password?: string }): Promise<TeacherInterface> => {
  console.log('addTeacherApi');
  debugger;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}teachers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacher),
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    console.log('addTeacherApi ok');
    debugger;

    return response.json() as Promise<TeacherInterface>;
  }
  catch (err) {
    console.log('>>> addTeacherApi', err);
    throw err;
  }
};

