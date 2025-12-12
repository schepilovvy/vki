import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Group } from './entity/Group.entity';
import { Student } from './entity/Student.entity';
import { Teacher } from './entity/Teacher.entity';
import { Discipline } from './entity/Discipline.entity';
import { Homework } from './entity/Homework.entity';
import { Grade } from './entity/Grade.entity';
import { User } from './entity/User.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB ?? './db/vki-web.db', // Path to your SQLite database file
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
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
      initializationPromise = null; // Сбрасываем промис при ошибке, чтобы можно было повторить
      throw err;
    });

  return initializationPromise;
};

export default AppDataSource;
