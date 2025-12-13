import 'reflect-metadata';
import 'tsconfig-paths/register';
import { addTeacherDb } from '../src/db/teacherDb';
import { initializeDataSource } from '../src/db/AppDataSource';

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

async function initTeachers() {
  try {
    await initializeDataSource();
    console.log('База данных инициализирована');

    const createdTeachers = [];
    const errors = [];

    for (const teacher of russianTeachers) {
      try {
        const newTeacher = await addTeacherDb(
          {
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            middleName: teacher.middleName,
          },
          'teacher123',
        );
        createdTeachers.push(newTeacher);
        console.log(`✓ Добавлен: ${teacher.lastName} ${teacher.firstName} ${teacher.middleName}`);
      }
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        errors.push({
          teacher: `${teacher.lastName} ${teacher.firstName} ${teacher.middleName}`,
          error: errorMessage,
        });
        console.log(`✗ Ошибка при добавлении ${teacher.lastName} ${teacher.firstName} ${teacher.middleName}: ${errorMessage}`);
      }
    }

    console.log('\n=== Результаты ===');
    console.log(`Успешно добавлено: ${createdTeachers.length}`);
    if (errors.length > 0) {
      console.log(`Ошибок: ${errors.length}`);
      errors.forEach((err) => {
        console.log(`  - ${err.teacher}: ${err.error}`);
      });
    }

    process.exit(0);
  }
  catch (error) {
    console.error('Критическая ошибка:', error);
    process.exit(1);
  }
}

initTeachers();

