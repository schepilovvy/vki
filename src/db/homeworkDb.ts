import { Homework } from './entity/Homework.entity';
import type HomeworkInterface from '@/types/HomeworkInterface';
import AppDataSource, { initializeDataSource } from './AppDataSource';

/**
 * Получение репозитория домашних заданий с проверкой соединения
 */
const getHomeworkRepository = async () => {
  if (!AppDataSource.isInitialized) {
    await initializeDataSource();
  }
  return AppDataSource.getRepository(Homework);
};

/**
 * Получение домашних заданий по дисциплине
 * @param disciplineId ИД дисциплины
 * @returns Promise<HomeworkInterface[]>
 */
export const getHomeworksByDisciplineDb = async (disciplineId: number): Promise<HomeworkInterface[]> => {
  const homeworkRepository = await getHomeworkRepository();
  return await homeworkRepository.find({
    where: { disciplineId },
    order: { dueDate: 'ASC' },
  });
};

/**
 * Получение всех домашних заданий
 * @returns Promise<HomeworkInterface[]>
 */
export const getHomeworksDb = async (): Promise<HomeworkInterface[]> => {
  const homeworkRepository = await getHomeworkRepository();
  return await homeworkRepository.find({
    order: { dueDate: 'ASC' },
  });
};

/**
 * Удаление домашнего задания
 * @param homeworkId ИД удаляемого домашнего задания
 * @returns Promise<number>
 */
export const deleteHomeworkDb = async (homeworkId: number): Promise<number> => {
  const homeworkRepository = await getHomeworkRepository();
  await homeworkRepository.delete(homeworkId);
  return homeworkId;
};

/**
 * Добавление домашнего задания
 * @param homeworkFields поля домашнего задания
 * @returns Promise<HomeworkInterface>
 */
export const addHomeworkDb = async (homeworkFields: Omit<HomeworkInterface, 'id'>): Promise<HomeworkInterface> => {
  if (!homeworkFields.disciplineId) {
    throw new Error('Дисциплина обязательна для домашнего задания');
  }
  if (!homeworkFields.description) {
    throw new Error('Описание домашнего задания обязательно');
  }
  const homeworkRepository = await getHomeworkRepository();
  const homework = new Homework();
  const newHomework = await homeworkRepository.save({
    ...homework,
    ...homeworkFields,
  });
  return newHomework;
};


