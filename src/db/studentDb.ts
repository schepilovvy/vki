import { Student } from './entity/Student.entity';
import type StudentInterface from '@/types/StudentInterface';
import getRandomFio from '@/utils/getRandomFio';
import AppDataSource, { initializeDataSource } from './AppDataSource';
import { createUserDb } from './userDb';
import { User, UserRole } from './entity/User.entity';

/**
 * Получение репозитория студентов с проверкой соединения
 */
const getStudentRepository = async () => {
  if (!AppDataSource.isInitialized) {
    await initializeDataSource();
  }
  return AppDataSource.getRepository(Student);
};

/**
 * Получение студентов
 * @returns Promise<StudentInterface[]>
 */
export const getStudentsDb = async (): Promise<StudentInterface[]> => {
  const studentRepository = await getStudentRepository();
  return await studentRepository.find();
};

/**
 * Удаления студента
 * @param studentId ИД удаляемого студента
 * @returns Promise<number>
 */
export const deleteStudentDb = async (studentId: number): Promise<number> => {
  const studentRepository = await getStudentRepository();
  await studentRepository.delete(studentId);
  return studentId;
};

/**
 * Полная очистка всех студентов
 * @returns Promise<number> - количество удаленных студентов
 */
export const deleteAllStudentsDb = async (): Promise<number> => {
  const studentRepository = await getStudentRepository();
  const result = await studentRepository.delete({});
  
  // Также удаляем связанных пользователей
  if (!AppDataSource.isInitialized) {
    await initializeDataSource();
  }
  const userRepository = AppDataSource.getRepository(User);
  await userRepository.delete({ role: UserRole.STUDENT });

  return result.affected || 0;
};

/**
 * Проверка уникальности ФИО среди студентов и преподавателей
 * @param lastName Фамилия
 * @param firstName Имя
 * @param middleName Отчество
 * @returns Promise<boolean> - true если ФИО уникально
 */
const isFioUnique = async (lastName: string, firstName: string, middleName: string): Promise<boolean> => {
  // Проверяем среди студентов
  const studentRepository = await getStudentRepository();
  const existingStudent = await studentRepository.findOne({
    where: {
      lastName,
      firstName,
      middleName,
    },
  });

  if (existingStudent) {
    return false;
  }

  // Проверяем среди преподавателей
  const { getTeachersDb } = await import('./teacherDb');
  const teachers = await getTeachersDb();
  const existingTeacher = teachers.find(
    t => !t.isDeleted && 
    t.lastName === lastName && 
    t.firstName === firstName && 
    t.middleName === middleName
  );

  return !existingTeacher;
};

/**
 * Добавление студента
 * @param studentFields поля студента
 * @param password пароль для создания пользователя
 * @returns Promise<StudentInterface>
 */
export const addStudentDb = async (
  studentFields: Omit<StudentInterface, 'id'>,
  password?: string,
): Promise<StudentInterface> => {
  // Проверяем уникальность ФИО
  const isUnique = await isFioUnique(
    studentFields.lastName,
    studentFields.firstName,
    studentFields.middleName,
  );

  if (!isUnique) {
    throw new Error('Студент или преподаватель с таким ФИО уже существует');
  }

  const studentRepository = await getStudentRepository();
  const student = new Student();
  const newStudent = await studentRepository.save({
    ...student,
    ...studentFields,
  });

  // Создаем пользователя с логином = ФИО и паролем
  if (password) {
    const login = `${studentFields.lastName} ${studentFields.firstName} ${studentFields.middleName}`.trim();
    try {
      await createUserDb(login, password, UserRole.STUDENT, newStudent.id, undefined);
    }
    catch (error) {
      // Если не удалось создать пользователя, логируем ошибку, но не прерываем создание студента
      console.error('Error creating user for student:', error);
    }
  }

  return newStudent;
};

/**
 * Добавление рандомных студента
 * @param amount количество рандомных записей
 * @returns Promise<StudentInterface>
 */
export const addRandomStudentsDb = async (amount: number = 10): Promise<StudentInterface[]> => {
  const students: StudentInterface[] = [];

  for (let i = 0; i < amount; i++) {
    const fio = getRandomFio();

    const newStudent = await addStudentDb({
      ...fio,
      contacts: 'contact',
      groupId: 1,
    });
    students.push(newStudent);
  }

  return students;
};

/**
 * Поиск студентов по имени
 * @param searchQuery Поисковый запрос (поиск по ФИО)
 * @returns Promise<StudentInterface[]>
 */
export const searchStudentsDb = async (searchQuery: string): Promise<StudentInterface[]> => {
  const studentRepository = await getStudentRepository();
  const query = `%${searchQuery}%`;
  return await studentRepository
    .createQueryBuilder('student')
    .where('student.firstName LIKE :query', { query })
    .orWhere('student.lastName LIKE :query', { query })
    .orWhere('student.middleName LIKE :query', { query })
    .orWhere("student.lastName || ' ' || student.firstName || ' ' || student.middleName LIKE :query", { query })
    .getMany();
};
