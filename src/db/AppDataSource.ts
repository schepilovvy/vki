import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { Group } from './entity/Group.entity';
import { Student } from './entity/Student.entity';
import { Teacher } from './entity/Teacher.entity';
import { Discipline } from './entity/Discipline.entity';
import { Homework } from './entity/Homework.entity';
import { Grade } from './entity/Grade.entity';
import { User } from './entity/User.entity';

// Получаем путь к БД относительно корня проекта
const getDatabasePath = (): string => {
  // Приоритет 1: Если указана переменная окружения, используем её
  if (process.env.DB) {
    const envPath = process.env.DB;
    console.log('Using DB path from environment:', envPath);
    if (!existsSync(envPath)) {
      console.warn(`WARNING: Database file does not exist at: ${envPath}`);
    }
    else {
      console.log('Database file found at:', envPath);
    }
    return envPath;
  }

  // Приоритет 2: Пытаемся найти БД относительно текущей рабочей директории
  const dbPath = resolve(process.cwd(), 'db', 'vki-web.db');
  console.log('Attempting DB path from process.cwd():', dbPath);
  console.log('Current working directory:', process.cwd());

  if (existsSync(dbPath)) {
    console.log('Database file found at:', dbPath);
    return dbPath;
  }

  // Приоритет 3: Пытаемся найти БД относительно корня проекта (для production)
  // Определяем корень проекта как директорию, где находится package.json
  try {
    const projectRoot = process.cwd();
    // Проверяем несколько возможных путей
    const possiblePaths = [
      resolve(projectRoot, 'db', 'vki-web.db'),
      resolve(projectRoot, '..', 'db', 'vki-web.db'),
      resolve(projectRoot, '..', '..', 'db', 'vki-web.db'),
    ];

    for (const path of possiblePaths) {
      if (existsSync(path)) {
        console.log('Database file found at:', path);
        return path;
      }
    }
  }
  catch (error) {
    console.error('Error searching for database:', error);
  }

  // Если ничего не найдено, используем путь относительно process.cwd()
  console.warn(`WARNING: Database file does not exist at: ${dbPath}`);
  console.warn('Make sure the db folder and vki-web.db file exist in the project root.');
  console.warn('Or set DB environment variable to point to your database file.');
  console.warn('Example: DB="D:/project/db/vki-web.db"');

  return dbPath;
};

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: getDatabasePath(),
  entities: [Group, Student, Teacher, Discipline, Homework, Grade, User],
  synchronize: true, // Auto-create schema on startup (use with caution in production)
  logging: false,
});

// Промис для отслеживания инициализации
let initializationPromise: Promise<void> | null = null;

/**
 * Инициализация соединения с БД (с защитой от множественных вызовов)
 */
export const initializeDataSource = async (): Promise<void> => {
  if (AppDataSource.isInitialized) {
    return;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = AppDataSource.initialize()
    .then(async () => {
      console.log('Data Source has been initialized!');
      console.log('Database path:', AppDataSource.options.database);

      // Проверяем количество данных в БД после инициализации
      try {
        const studentRepo = AppDataSource.getRepository(Student);
        const teacherRepo = AppDataSource.getRepository(Teacher);
        const groupRepo = AppDataSource.getRepository(Group);

        const studentCount = await studentRepo.count();
        const teacherCount = await teacherRepo.count();
        const groupCount = await groupRepo.count();

        console.log('Database contents after initialization:');
        console.log(`  Students: ${studentCount}`);
        console.log(`  Teachers: ${teacherCount}`);
        console.log(`  Groups: ${groupCount}`);
      }
      catch (error) {
        console.error('Error checking database contents:', error);
      }

      // Выполняем миграцию для обновления поля name у существующих преподавателей
      try {
        const { migrateTeacherNames } = await import('./teacherDb');
        await migrateTeacherNames();
      }
      catch (error) {
        console.error('Error during teacher names migration:', error);
      }
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
      initializationPromise = null; // Сбрасываем промис при ошибке, чтобы можно было повторить
      throw err;
    });

  return initializationPromise;
};

export default AppDataSource;
