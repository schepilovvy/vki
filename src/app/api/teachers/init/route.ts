import { addTeacherDb } from '@/db/teacherDb';

const russianTeachers = [
  { lastName: 'Иванов', firstName: 'Александр', middleName: 'Сергеевич' },
  { lastName: 'Петрова', firstName: 'Елена', middleName: 'Владимировна' },
  { lastName: 'Смирнов', firstName: 'Дмитрий', middleName: 'Александрович' },
  { lastName: 'Козлова', firstName: 'Мария', middleName: 'Ивановна' },
  { lastName: 'Волков', firstName: 'Андрей', middleName: 'Николаевич' },
  { lastName: 'Новикова', firstName: 'Ольга', middleName: 'Петровна' },
  { lastName: 'Соколов', firstName: 'Михаил', middleName: 'Викторович' },
  { lastName: 'Морозова', firstName: 'Анна', middleName: 'Дмитриевна' },
  { lastName: 'Лебедев', firstName: 'Сергей', middleName: 'Андреевич' },
  { lastName: 'Федорова', firstName: 'Татьяна', middleName: 'Сергеевна' },
];

export async function GET(): Promise<Response> {
  try {
    const createdTeachers = [];
    const errors = [];

    for (const teacher of russianTeachers) {
      try {
        const newTeacher = await addTeacherDb(
          {
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            middleName: teacher.middleName,
            contacts: '',
          },
          'teacher123',
        );
        createdTeachers.push(newTeacher);
      }
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        errors.push({
          teacher: `${teacher.lastName} ${teacher.firstName} ${teacher.middleName}`,
          error: errorMessage,
        });
      }
    }

    return new Response(JSON.stringify({
      message: 'Преподаватели инициализированы',
      created: createdTeachers.length,
      teachers: createdTeachers,
      errors: errors.length > 0 ? errors : undefined,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error in GET /api/teachers/init:', error);
    return new Response(JSON.stringify({ error: 'Ошибка при инициализации преподавателей' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
