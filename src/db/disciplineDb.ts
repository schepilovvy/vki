import { Discipline } from './entity/Discipline.entity';
import type DisciplineInterface from '@/types/DisciplineInterface';
import AppDataSource, { initializeDataSource } from './AppDataSource';
import type { Repository } from 'typeorm';

/**
 * Получение репозитория дисциплин с проверкой соединения
 */
const getDisciplineRepository = async (): Promise<Repository<Discipline>> => {
  if (!AppDataSource.isInitialized) {
    await initializeDataSource();
  }
  return AppDataSource.getRepository(Discipline);
};

/**
 * Получение дисциплин
 * @returns Promise<DisciplineInterface[]>
 */
export const getDisciplinesDb = async (): Promise<DisciplineInterface[]> => {
  const disciplineRepository = await getDisciplineRepository();
  return await disciplineRepository.find();
};

/**
 * Получение дисциплин по группе
 * @param groupId ИД группы
 * @returns Promise<DisciplineInterface[]>
 */
export const getDisciplinesByGroupDb = async (groupId: number): Promise<DisciplineInterface[]> => {
  const disciplineRepository = await getDisciplineRepository();
  return await disciplineRepository.find({
    where: { groupId },
    order: { name: 'ASC' },
  });
};

/**
 * Удаление дисциплины
 * @param disciplineId ИД удаляемой дисциплины
 * @returns Promise<number>
 */
export const deleteDisciplineDb = async (disciplineId: number): Promise<number> => {
  const disciplineRepository = await getDisciplineRepository();
  await disciplineRepository.delete(disciplineId);
  return disciplineId;
};

/**
 * Добавление дисциплины
 * @param disciplineFields поля дисциплины
 * @returns Promise<DisciplineInterface>
 */
export const addDisciplineDb = async (disciplineFields: Omit<DisciplineInterface, 'id'>): Promise<DisciplineInterface> => {
  if (!disciplineFields.groupId) {
    throw new Error('Группа обязательна для дисциплины');
  }
  if (!disciplineFields.teacherId) {
    throw new Error('Преподаватель обязателен для дисциплины');
  }
  if (!disciplineFields.name) {
    throw new Error('Название дисциплины обязательно');
  }
  const disciplineRepository = await getDisciplineRepository();
  const discipline = new Discipline();
  const newDiscipline = await disciplineRepository.save({
    ...discipline,
    ...disciplineFields,
  });
  return newDiscipline;
};

/**
 * Поиск дисциплин по названию
 * @param searchQuery Поисковый запрос (поиск по названию дисциплины)
 * @returns Promise<DisciplineInterface[]>
 */
export const searchDisciplinesDb = async (searchQuery: string): Promise<DisciplineInterface[]> => {
  const disciplineRepository = await getDisciplineRepository();
  const query = `%${searchQuery}%`;
  return await disciplineRepository
    .createQueryBuilder('discipline')
    .where('discipline.name LIKE :query', { query })
    .getMany();
};
