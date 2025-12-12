import 'reflect-metadata';
import 'tsconfig-paths/register';
import { initializeDataSource } from '../src/db/AppDataSource';
import { getStudentsDb } from '../src/db/studentDb';
import { getUserByLoginDb } from '../src/db/userDb';
import { User } from '../src/db/entity/User.entity';
import AppDataSource from '../src/db/AppDataSource';

async function checkUsers() {
  try {
    if (!process.env.DB) {
      process.env.DB = './db/vki-web-orm.db';
    }
    
    await initializeDataSource();
    console.log('База данных инициализирована');

    const students = await getStudentsDb();
    console.log(`\nВсего студентов: ${students.length}`);

    const userRepository = AppDataSource.getRepository(User);
    const allUsers = await userRepository.find();
    console.log(`Всего пользователей: ${allUsers.length}`);

    const studentUsers = allUsers.filter(u => u.role === 'student');
    console.log(`Пользователей-студентов: ${studentUsers.length}`);

    console.log('\n=== Проверка первых 5 студентов ===');
    for (let i = 0; i < Math.min(5, students.length); i++) {
      const student = students[i];
      const login = `${student.lastName} ${student.firstName} ${student.middleName}`.trim();
      const user = await getUserByLoginDb(login);
      
      console.log(`\nСтудент ${i + 1}:`);
      console.log(`  ФИО: ${login}`);
      console.log(`  ID студента: ${student.id}`);
      console.log(`  Пользователь существует: ${user ? 'ДА' : 'НЕТ'}`);
      if (user) {
        console.log(`  ID пользователя: ${user.id}`);
        console.log(`  studentId в пользователе: ${user.studentId}`);
        console.log(`  Совпадает: ${user.studentId === student.id ? 'ДА' : 'НЕТ'}`);
      }
    }

    console.log('\n=== Студенты без пользователей ===');
    let studentsWithoutUsers = 0;
    for (const student of students) {
      const login = `${student.lastName} ${student.firstName} ${student.middleName}`.trim();
      const user = await getUserByLoginDb(login);
      if (!user) {
        studentsWithoutUsers++;
        if (studentsWithoutUsers <= 10) {
          console.log(`  - ${login} (ID: ${student.id})`);
        }
      }
    }
    console.log(`Всего студентов без пользователей: ${studentsWithoutUsers}`);

    process.exit(0);
  }
  catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

checkUsers();

