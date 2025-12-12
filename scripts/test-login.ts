import 'reflect-metadata';
import 'tsconfig-paths/register';
import { initializeDataSource } from '../src/db/AppDataSource';
import { getStudentsDb } from '../src/db/studentDb';
import { verifyUserDb, getUserByLoginDb } from '../src/db/userDb';

async function testLogin() {
  try {
    if (!process.env.DB) {
      process.env.DB = './db/vki-web-orm.db';
    }
    
    await initializeDataSource();
    console.log('База данных инициализирована\n');

    const students = await getStudentsDb();
    if (students.length === 0) {
      console.log('Нет студентов в базе');
      process.exit(0);
    }

    const testStudent = students[0];
    const login = `${testStudent.lastName} ${testStudent.firstName} ${testStudent.middleName}`.trim();
    const password = 'student1';

    console.log('=== Тест входа ===');
    console.log(`Логин: "${login}"`);
    console.log(`Пароль: "${password}"`);
    console.log(`Длина логина: ${login.length}`);
    console.log(`Символы логина:`, JSON.stringify(login));

    const user = await getUserByLoginDb(login);
    console.log(`\nПользователь найден: ${user ? 'ДА' : 'НЕТ'}`);
    if (user) {
      console.log(`ID пользователя: ${user.id}`);
      console.log(`Логин в БД: "${user.login}"`);
      console.log(`Длина логина в БД: ${user.login.length}`);
      console.log(`Символы логина в БД:`, JSON.stringify(user.login));
      console.log(`Логины совпадают: ${user.login === login}`);
      console.log(`Роль: ${user.role}`);
      console.log(`studentId: ${user.studentId}`);
    }

    console.log('\n=== Проверка пароля ===');
    const verificationResult = await verifyUserDb(login, password);
    console.log(`Результат проверки: ${verificationResult ? 'УСПЕХ' : 'ОШИБКА'}`);
    if (verificationResult) {
      console.log(`Верифицированный пользователь:`, verificationResult);
    } else {
      console.log('Пароль неверный или пользователь не найден');
    }

    console.log('\n=== Альтернативные варианты логина ===');
    const variants = [
      login,
      login.trim(),
      login.replace(/\s+/g, ' '),
      login.toLowerCase(),
      login.toUpperCase(),
    ];

    for (const variant of variants) {
      const userVariant = await getUserByLoginDb(variant);
      if (userVariant) {
        console.log(`✓ Найден пользователь для варианта: "${variant}"`);
        const verifyVariant = await verifyUserDb(variant, password);
        console.log(`  Проверка пароля: ${verifyVariant ? 'УСПЕХ' : 'ОШИБКА'}`);
      }
    }

    process.exit(0);
  }
  catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

testLogin();

