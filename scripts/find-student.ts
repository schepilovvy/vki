import 'reflect-metadata';
import 'tsconfig-paths/register';
import { initializeDataSource } from '../src/db/AppDataSource';
import { getStudentsDb } from '../src/db/studentDb';
import { getUserByLoginDb } from '../src/db/userDb';
import AppDataSource from '../src/db/AppDataSource';

async function findStudent() {
  try {
    process.env.DB = 'd:/vki/vki-web-orm.db';
    
    await initializeDataSource();
    console.log('База данных инициализирована');
    console.log('DB path:', AppDataSource.options.database);

    const students = await getStudentsDb();
    console.log(`\nВсего студентов: ${students.length}`);

    const searchLogin = 'Волков Георгий Ярославовна';
    console.log(`\n=== Поиск студента: "${searchLogin}" ===`);
    
    const student = students.find(s => {
      const login = `${s.lastName} ${s.firstName} ${s.middleName}`.trim();
      return login === searchLogin;
    });

    if (student) {
      console.log('✓ Студент найден!');
      console.log(`  ID: ${student.id}`);
      console.log(`  ФИО: ${student.lastName} ${student.firstName} ${student.middleName}`);
      console.log(`  Группа ID: ${student.groupId}`);
      
      const user = await getUserByLoginDb(searchLogin);
      console.log(`  Пользователь: ${user ? 'ДА' : 'НЕТ'}`);
      if (user) {
        console.log(`  ID пользователя: ${user.id}`);
        console.log(`  studentId в пользователе: ${user.studentId}`);
      }
    } else {
      console.log('✗ Студент НЕ найден в этой базе!');
      console.log('\n=== Похожие студенты с фамилией "Волков" ===');
      const volkovStudents = students.filter(s => s.lastName.includes('Волков'));
      volkovStudents.forEach((s, i) => {
        const login = `${s.lastName} ${s.firstName} ${s.middleName}`.trim();
        console.log(`  ${i + 1}. ${login} (ID: ${s.id})`);
      });
    }

    console.log('\n=== Первые 5 студентов с пользователями ===');
    let count = 0;
    for (const s of students) {
      if (count >= 5) break;
      const login = `${s.lastName} ${s.firstName} ${s.middleName}`.trim();
      const user = await getUserByLoginDb(login);
      if (user) {
        console.log(`  ${count + 1}. ${login} (ID студента: ${s.id}, пароль: student${s.id})`);
        count++;
      }
    }

    process.exit(0);
  }
  catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

findStudent();

