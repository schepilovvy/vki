import { Teacher } from './entity/Teacher.entity';
import type TeacherInterface from '@/types/TeacherInterface';
import AppDataSource, { initializeDataSource } from './AppDataSource';
import { createUserDb } from './userDb';
import { UserRole } from './entity/User.entity';

/**
 * Получение репозитория преподавателей с проверкой соединения
 */
const getTeacherRepository = async () => {
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
  const teacherRepository = await getTeacherRepository();
  return await teacherRepository.find();
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
    s => !s.isDeleted && 
    s.lastName === lastName && 
    s.firstName === firstName && 
    s.middleName === middleName
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

  const teacherRepository = await getTeacherRepository();
  const teacher = new Teacher();
  const newTeacher = await teacherRepository.save({
    ...teacher,
    ...teacherFields,
  });

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

