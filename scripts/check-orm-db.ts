import 'reflect-metadata';
import 'tsconfig-paths/register';
import { initializeDataSource } from '../src/db/AppDataSource';
import { getStudentsDb } from '../src/db/studentDb';
import { getUserByLoginDb } from '../src/db/userDb';
import AppDataSource from '../src/db/AppDataSource';

async function checkOrmDb() {
  try {
    process.env.DB = 'd:/vki/vki-web-orm.db';
    
    await initializeDataSource();
    console.log('База данных инициализирована');
    console.log('DB path:', AppDataSource.options.database);
    console.log('DB path (env):', process.env.DB);

    const students = await getStudentsDb();
    console.log(`\nВсего студентов: ${students.length}`);

    if (students.length > 0) {
      console.log('\nПервые 3 студента:');
      for (let i = 0; i < Math.min(3, students.length); i++) {
        const student = students[i];
        const login = `${student.lastName} ${student.firstName} ${student.middleName}`.trim();
        const user = await getUserByLoginDb(login);
        console.log(`  ${i + 1}. ${login} - пользователь: ${user ? 'ДА' : 'НЕТ'}`);
      }
    } else {
      console.log('\nСтудентов нет в базе! Нужно создать.');
    }

    process.exit(0);
  }
  catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

checkOrmDb();

