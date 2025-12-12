import 'reflect-metadata';
import 'tsconfig-paths/register';
import { initializeDataSource } from '../src/db/AppDataSource';
import { getStudentsDb } from '../src/db/studentDb';
import { getUserByLoginDb } from '../src/db/userDb';
import { User } from '../src/db/entity/User.entity';
import AppDataSource from '../src/db/AppDataSource';

async function debugLogin() {
  try {
    if (!process.env.DB) {
      process.env.DB = './db/vki-web-orm.db';
    }
    
    await initializeDataSource();
    console.log('База данных инициализирована\n');

    const testLogin = 'Волков Георгий Ярославовна';
    console.log('=== Тестовый логин ===');
    console.log(`Логин: "${testLogin}"`);
    console.log(`Длина: ${testLogin.length}`);
    console.log(`JSON: ${JSON.stringify(testLogin)}`);
    console.log(`Коды символов:`, Array.from(testLogin).map(c => c.charCodeAt(0)).join(', '));

    const userRepository = AppDataSource.getRepository(User);
    const allUsers = await userRepository.find();
    console.log(`\nВсего пользователей в БД: ${allUsers.length}`);

    const studentUsers = allUsers.filter(u => u.role === 'student');
    console.log(`Пользователей-студентов: ${studentUsers.length}\n`);

    console.log('=== Первые 5 пользователей-студентов ===');
    for (let i = 0; i < Math.min(5, studentUsers.length); i++) {
      const user = studentUsers[i];
      console.log(`\nПользователь ${i + 1}:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Логин: "${user.login}"`);
      console.log(`  Длина логина: ${user.login.length}`);
      console.log(`  JSON: ${JSON.stringify(user.login)}`);
      console.log(`  Коды символов:`, Array.from(user.login).map(c => c.charCodeAt(0)).join(', '));
      console.log(`  Совпадает с тестовым: ${user.login === testLogin}`);
      console.log(`  studentId: ${user.studentId}`);
    }

    console.log('\n=== Поиск через getUserByLoginDb ===');
    const foundUser = await getUserByLoginDb(testLogin);
    console.log(`Найден: ${foundUser ? 'ДА' : 'НЕТ'}`);
    if (foundUser) {
      console.log(`  ID: ${foundUser.id}`);
      console.log(`  Логин: "${foundUser.login}"`);
    }

    console.log('\n=== Поиск через прямой запрос ===');
    const directUser = await userRepository.findOne({ 
      where: { login: testLogin } 
    });
    console.log(`Найден: ${directUser ? 'ДА' : 'НЕТ'}`);
    if (directUser) {
      console.log(`  ID: ${directUser.id}`);
      console.log(`  Логин: "${directUser.login}"`);
    }

    console.log('\n=== Поиск через LIKE ===');
    const likeUsers = await userRepository
      .createQueryBuilder('user')
      .where('user.login LIKE :login', { login: `%${testLogin}%` })
      .getMany();
    console.log(`Найдено через LIKE: ${likeUsers.length}`);
    likeUsers.forEach((u, i) => {
      console.log(`  ${i + 1}. "${u.login}" (ID: ${u.id})`);
    });

    console.log('\n=== Поиск всех пользователей с "Волков" ===');
    const volkovUsers = await userRepository
      .createQueryBuilder('user')
      .where('user.login LIKE :pattern', { pattern: '%Волков%' })
      .getMany();
    console.log(`Найдено: ${volkovUsers.length}`);
    volkovUsers.forEach((u, i) => {
      console.log(`  ${i + 1}. "${u.login}" (ID: ${u.id}, роль: ${u.role})`);
    });

    process.exit(0);
  }
  catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

debugLogin();

