import 'reflect-metadata';
import 'tsconfig-paths/register';
import { initializeDataSource } from '../src/db/AppDataSource';
import { getStudentsDb } from '../src/db/studentDb';
import { getUserByLoginDb, verifyUserDb } from '../src/db/userDb';
import AppDataSource from '../src/db/AppDataSource';

async function checkNewStudents() {
  try {
    process.env.DB = 'd:/vki/vki-web-orm.db';
    
    await initializeDataSource();
    console.log('База данных инициализирована');
    console.log('DB path:', AppDataSource.options.database);

    const students = await getStudentsDb();
    console.log(`\nВсего студентов: ${students.length}`);

    // Проверяем последних 5 студентов (новые должны быть в конце)
    console.log('\n=== Последние 5 студентов ===');
    const lastStudents = students.slice(-5);
    for (let i = 0; i < lastStudents.length; i++) {
      const student = lastStudents[i];
      const login = `${student.lastName} ${student.firstName} ${student.middleName}`.trim();
      const user = await getUserByLoginDb(login);
      console.log(`\n${i + 1}. ${login}`);
      console.log(`   ID студента: ${student.id}`);
      console.log(`   Пользователь: ${user ? 'ДА' : 'НЕТ'}`);
      if (user) {
        console.log(`   ID пользователя: ${user.id}`);
        console.log(`   studentId в пользователе: ${user.studentId}`);
        // Пробуем найти пароль
        const password = `student${student.id}`;
        const verifyResult = await verifyUserDb(login, password);
        console.log(`   Проверка пароля "${password}": ${verifyResult ? 'УСПЕХ' : 'ОШИБКА'}`);
      }
    }

    // Проверяем первого нового студента (Попова Арина Федоровна)
    console.log('\n=== Проверка первого нового студента ===');
    const testLogin = 'Попова Арина Федоровна';
    const testPassword = 'student1';
    const testUser = await getUserByLoginDb(testLogin);
    console.log(`Логин: "${testLogin}"`);
    console.log(`Пользователь найден: ${testUser ? 'ДА' : 'НЕТ'}`);
    if (testUser) {
      console.log(`ID пользователя: ${testUser.id}`);
      const verifyResult = await verifyUserDb(testLogin, testPassword);
      console.log(`Проверка пароля "${testPassword}": ${verifyResult ? 'УСПЕХ' : 'ОШИБКА'}`);
    }

    process.exit(0);
  }
  catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

checkNewStudents();

