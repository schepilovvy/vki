import 'reflect-metadata';
import 'tsconfig-paths/register';
import { initializeDataSource } from '../src/db/AppDataSource';
import { getStudentsDb } from '../src/db/studentDb';
import { createUserDb } from '../src/db/userDb';
import { UserRole } from '../src/db/entity/User.entity';
import AppDataSource from '../src/db/AppDataSource';

async function createUserForStudent() {
  try {
    process.env.DB = 'd:/vki/vki-web-orm.db';
    
    await initializeDataSource();
    console.log('База данных инициализирована');
    console.log('DB path:', AppDataSource.options.database);

    const students = await getStudentsDb();
    const searchLogin = 'Волков Георгий Ярославовна';
    
    const student = students.find(s => {
      const login = `${s.lastName} ${s.firstName} ${s.middleName}`.trim();
      return login === searchLogin;
    });

    if (!student) {
      console.log('Студент не найден!');
      process.exit(1);
    }

    console.log(`\nНайден студент: ${student.lastName} ${student.firstName} ${student.middleName}`);
    console.log(`ID студента: ${student.id}`);

    const login = `${student.lastName} ${student.firstName} ${student.middleName}`.trim();
    const password = 'student1';

    try {
      const user = await createUserDb(login, password, UserRole.STUDENT, student.id, undefined);
      console.log(`\n✓ Пользователь успешно создан!`);
      console.log(`  Логин: "${login}"`);
      console.log(`  Пароль: "${password}"`);
      console.log(`  ID пользователя: ${user.id}`);
      console.log(`  studentId: ${user.studentId}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('уже существует')) {
        console.log('\n✗ Пользователь уже существует');
      } else {
        throw error;
      }
    }

    process.exit(0);
  }
  catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

createUserForStudent();

