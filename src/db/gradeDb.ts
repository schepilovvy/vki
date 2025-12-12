import { Grade } from './entity/Grade.entity';
import type GradeInterface from '@/types/GradeInterface';
import AppDataSource, { initializeDataSource } from './AppDataSource';

/**
 * Получение репозитория оценок с проверкой соединения
 */
const getGradeRepository = async () => {
  if (!AppDataSource.isInitialized) {
    await initializeDataSource();
  }
  return AppDataSource.getRepository(Grade);
};

/**
 * Получение оценок по дисциплине
 * @param disciplineId ИД дисциплины
 * @returns Promise<GradeInterface[]>
 */
export const getGradesByDisciplineDb = async (disciplineId: number): Promise<GradeInterface[]> => {
  const gradeRepository = await getGradeRepository();
  return await gradeRepository.find({
    where: { disciplineId },
    order: { date: 'DESC' },
  });
};

/**
 * Получение оценок студента по дисциплине
 * @param studentId ИД студента
 * @param disciplineId ИД дисциплины
 * @returns Promise<GradeInterface[]>
 */
export const getGradesByStudentAndDisciplineDb = async (studentId: number, disciplineId: number): Promise<GradeInterface[]> => {
  const gradeRepository = await getGradeRepository();
  return await gradeRepository.find({
    where: { studentId, disciplineId },
    order: { date: 'DESC' },
  });
};

/**
 * Получение всех оценок студента
 * @param studentId ИД студента
 * @returns Promise<GradeInterface[]>
 */
export const getGradesByStudentDb = async (studentId: number): Promise<GradeInterface[]> => {
  const gradeRepository = await getGradeRepository();
  return await gradeRepository.find({
    where: { studentId },
    order: { date: 'DESC' },
  });
};

/**
 * Удаление оценки
 * @param gradeId ИД удаляемой оценки
 * @returns Promise<number>
 */
export const deleteGradeDb = async (gradeId: number): Promise<number> => {
  const gradeRepository = await getGradeRepository();
  await gradeRepository.delete(gradeId);
  return gradeId;
};

/**
 * Добавление оценки
 * @param gradeFields поля оценки
 * @returns Promise<GradeInterface>
 */
export const addGradeDb = async (gradeFields: Omit<GradeInterface, 'id'>): Promise<GradeInterface> => {
  if (!gradeFields.studentId) {
    throw new Error('Студент обязателен для оценки');
  }
  if (!gradeFields.disciplineId) {
    throw new Error('Дисциплина обязательна для оценки');
  }
  if (!gradeFields.grade || gradeFields.grade < 2 || gradeFields.grade > 5) {
    throw new Error('Оценка должна быть от 2 до 5');
  }
  const gradeRepository = await getGradeRepository();
  const grade = new Grade();
  const newGrade = await gradeRepository.save({
    ...grade,
    ...gradeFields,
    date: gradeFields.date || new Date().toISOString(),
  });
  return newGrade;
};

