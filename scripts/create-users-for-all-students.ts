import 'reflect-metadata';
import 'tsconfig-paths/register';
import { initializeDataSource } from '../src/db/AppDataSource';
import { getStudentsDb } from '../src/db/studentDb';
import { createUserDb, getUserByLoginDb } from '../src/db/userDb';
import { UserRole } from '../src/db/entity/User.entity';
import AppDataSource from '../src/db/AppDataSource';

async function createUsersForAllStudents() {
  try {
    process.env.DB = 'd:/vki/vki-web-orm.db';
    
    await initializeDataSource();
    console.log('База данных инициализирована');
    console.log('DB path:', AppDataSource.options.database);

    const students = await getStudentsDb();
    console.log(`\nВсего студентов: ${students.length}`);

    let createdCount = 0;
    let existingCount = 0;
    let errorCount = 0;

    for (const student of students) {
      const login = `${student.lastName} ${student.firstName} ${student.middleName}`.trim();
      const existingUser = await getUserByLoginDb(login);
      
      if (existingUser) {
        existingCount++;
        continue;
      }

      // Определяем пароль на основе ID студента
      // Для старых студентов (ID 1-50) используем student1-student50
      // Для новых студентов (ID 51+) используем student1-student50 по порядку создания
      const password = `student${student.id}`;

      try {
        await createUserDb(login, password, UserRole.STUDENT, student.id, undefined);
        createdCount++;
        if (createdCount <= 10) {
          console.log(`✓ Создан пользователь: ${login} (пароль: ${password})`);
        }
      } catch (error) {
        errorCount++;
        if (errorCount <= 5) {
          console.log(`✗ Ошибка для ${login}: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
        }
      }
    }

    console.log(`\n=== Результаты ===`);
    console.log(`Создано пользователей: ${createdCount}`);
    console.log(`Уже существовало: ${existingCount}`);
    console.log(`Ошибок: ${errorCount}`);

    process.exit(0);
  }
  catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

createUsersForAllStudents();

