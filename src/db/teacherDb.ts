import { Teacher } from './entity/Teacher.entity';
import type TeacherInterface from '@/types/TeacherInterface';
import AppDataSource, { initializeDataSource } from './AppDataSource';
import { createUserDb } from './userDb';
import { UserRole } from './entity/User.entity';
import type { Repository } from 'typeorm';

/**
 * Получение репозитория преподавателей с проверкой соединения
 */
const getTeacherRepository = async (): Promise<Repository<Teacher>> => {
  if (!AppDataSource.isInitialized) {
    await initializeDataSource();
  }
  return AppDataSource.getRepository(Teacher);
};

/**
 * Получение преподавателей
 * @returns Promise<TeacherInterface[]>
 */
export const getTeachersDb = async (): Promise<TeacherInterface[]> => {
  try {
    const teacherRepository = await getTeacherRepository();
    const teachers = await teacherRepository.find();
    console.log(`getTeachersDb: Found ${teachers.length} teachers`);
    return teachers;
  }
  catch (error) {
    console.error('Error in getTeachersDb:', error);
    throw error;
  }
};

/**
 * Удаление преподавателя
 * @param teacherId ИД удаляемого преподавателя
 * @returns Promise<number>
 */
export const deleteTeacherDb = async (teacherId: number): Promise<number> => {
  const teacherRepository = await getTeacherRepository();
  await teacherRepository.delete(teacherId);
  return teacherId;
};

/**
 * Проверка уникальности ФИО среди студентов и преподавателей
 * @param lastName Фамилия
 * @param firstName Имя
 * @param middleName Отчество
 * @returns Promise<boolean> - true если ФИО уникально
 */
const isFioUnique = async (lastName: string, firstName: string, middleName: string): Promise<boolean> => {
  // Проверяем среди преподавателей
  const teacherRepository = await getTeacherRepository();
  const existingTeacher = await teacherRepository.findOne({
    where: {
      lastName,
      firstName,
      middleName,
    },
  });

  if (existingTeacher) {
    return false;
  }

  // Проверяем среди студентов
  const { getStudentsDb } = await import('./studentDb');
  const students = await getStudentsDb();
  const existingStudent = students.find(
    s => !s.isDeleted
      && s.lastName === lastName
      && s.firstName === firstName
      && s.middleName === middleName,
  );

  return !existingStudent;
};

/**
 * Добавление преподавателя
 * @param teacherFields поля преподавателя
 * @param password пароль для создания пользователя
 * @returns Promise<TeacherInterface>
 */
export const addTeacherDb = async (
  teacherFields: Omit<TeacherInterface, 'id'>,
  password?: string,
): Promise<TeacherInterface> => {
  // Проверяем уникальность ФИО
  const isUnique = await isFioUnique(
    teacherFields.lastName,
    teacherFields.firstName,
    teacherFields.middleName,
  );

  if (!isUnique) {
    throw new Error('Студент или преподаватель с таким ФИО уже существует');
  }

  // Формируем name из ФИО
  const fullName = `${teacherFields.lastName} ${teacherFields.firstName} ${teacherFields.middleName}`.trim();

  // Используем raw SQL для вставки, чтобы сразу установить teacherId = id
  // SQLite не позволяет использовать id в INSERT напрямую, поэтому делаем в два шага через транзакцию
  const queryRunner = AppDataSource.createQueryRunner();
  let transactionStarted = false;

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    transactionStarted = true;

    // Вставляем запись с временным teacherId = 0
    await queryRunner.query(
      'INSERT INTO "teacher" ("name", "firstName", "lastName", "middleName", "teacherId") VALUES (?, ?, ?, ?, 0)',
      [fullName, teacherFields.firstName, teacherFields.lastName, teacherFields.middleName],
    );

    // Получаем ID вставленной записи через last_insert_rowid()
    const idResult = await queryRunner.query('SELECT last_insert_rowid() as id');
    const insertedId = idResult[0]?.id;

    if (!insertedId) {
      await queryRunner.rollbackTransaction();
      transactionStarted = false;
      throw new Error('Не удалось получить ID созданного преподавателя');
    }

    // Обновляем teacherId = id
    await queryRunner.query(
      'UPDATE "teacher" SET "teacherId" = ? WHERE "id" = ?',
      [insertedId, insertedId],
    );

    // Загружаем полный объект преподавателя через queryRunner перед коммитом
    const teacherRepo = queryRunner.manager.getRepository(Teacher);
    const newTeacher = await teacherRepo.findOne({ where: { id: insertedId } });
    if (!newTeacher) {
      console.error(`Failed to find teacher with id ${insertedId} after insert`);
      await queryRunner.rollbackTransaction();
      transactionStarted = false;
      throw new Error('Не удалось создать преподавателя');
    }

    await queryRunner.commitTransaction();
    transactionStarted = false;

    // Создаем пользователя с логином = ФИО и паролем
    if (password) {
      const login = `${teacherFields.lastName} ${teacherFields.firstName} ${teacherFields.middleName}`.trim();
      try {
        await createUserDb(login, password, UserRole.TEACHER, undefined, newTeacher.id);
      }
      catch (error) {
        // Если не удалось создать пользователя, логируем ошибку, но не прерываем создание преподавателя
        console.error('Error creating user for teacher:', error);
      }
    }

    return newTeacher;
  }
  catch (error) {
    if (transactionStarted) {
      try {
        await queryRunner.rollbackTransaction();
      }
      catch (rollbackError) {
        console.error('Error during transaction rollback:', rollbackError);
      }
    }
    throw error;
  }
  finally {
    await queryRunner.release();
  }
};

/**
 * Миграция: обновляет поле name для существующих записей преподавателей
 * Генерирует name из ФИО для записей, где name пустой или NULL
 */
export const migrateTeacherNames = async (): Promise<void> => {
  if (!AppDataSource.isInitialized) {
    return;
  }

  try {
    // Проверяем, есть ли записи без name
    const teachersWithoutName = await AppDataSource.query(
      'SELECT COUNT(*) as count FROM "teacher" WHERE "name" IS NULL OR "name" = \'\'',
    );
    const count = teachersWithoutName[0]?.count || 0;

    if (count > 0) {
      console.log(`Migrating ${count} teacher records: adding name field...`);
      // Обновляем все записи, где name пустой, NULL или отсутствует
      await AppDataSource.query(
        'UPDATE "teacher" SET "name" = TRIM("lastName" || \' \' || "firstName" || \' \' || "middleName") WHERE "name" IS NULL OR "name" = \'\'',
      );
      console.log('Teacher names migration completed successfully');
    }
  }
  catch (error) {
    console.error('Error migrating teacher names:', error);
    // Не выбрасываем ошибку, чтобы не блокировать инициализацию
  }
};

/**
 * Поиск преподавателей по имени
 * @param searchQuery Поисковый запрос (поиск по ФИО)
 * @returns Promise<TeacherInterface[]>
 */
export const searchTeachersDb = async (searchQuery: string): Promise<TeacherInterface[]> => {
  const teacherRepository = await getTeacherRepository();
  const query = `%${searchQuery}%`;
  return await teacherRepository
    .createQueryBuilder('teacher')
    .where('teacher.firstName LIKE :query', { query })
    .orWhere('teacher.lastName LIKE :query', { query })
    .orWhere('teacher.middleName LIKE :query', { query })
    .orWhere("teacher.lastName || ' ' || teacher.firstName || ' ' || teacher.middleName LIKE :query", { query })
    .getMany();
};
