import 'reflect-metadata';
import 'tsconfig-paths/register';
import { initializeDataSource } from '../src/db/AppDataSource';
import { getStudentsDb } from '../src/db/studentDb';
import { getUserByLoginDb, verifyUserDb } from '../src/db/userDb';

async function checkPasswords() {
  try {
    if (!process.env.DB) {
      process.env.DB = './db/vki-web-orm.db';
    }
    
    await initializeDataSource();
    console.log('База данных инициализирована\n');

    const students = await getStudentsDb();
    console.log(`Всего студентов: ${students.length}\n`);

    console.log('=== Проверка паролей для первых 10 студентов ===\n');
    
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < Math.min(10, students.length); i++) {
      const student = students[i];
      const login = `${student.lastName} ${student.firstName} ${student.middleName}`.trim();
      
      const passwordsToTest = [
        `student${i + 1}`,
        `student${student.id}`,
      ];

      const user = await getUserByLoginDb(login);
      if (!user) {
        console.log(`${i + 1}. ${login} - Пользователь не найден`);
        failCount++;
        continue;
      }

      let found = false;
      for (const password of passwordsToTest) {
        const result = await verifyUserDb(login, password);
        if (result) {
          console.log(`${i + 1}. ${login}`);
          console.log(`   ✓ Пароль работает: "${password}"`);
          successCount++;
          found = true;
          break;
        }
      }

      if (!found) {
        console.log(`${i + 1}. ${login}`);
        console.log(`   ✗ Ни один из тестовых паролей не подошел`);
        console.log(`   Тестировались: ${passwordsToTest.join(', ')}`);
        failCount++;
      }
    }

    console.log(`\n=== Результаты ===`);
    console.log(`Успешных: ${successCount}`);
    console.log(`Неудачных: ${failCount}`);

    process.exit(0);
  }
  catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

checkPasswords();

