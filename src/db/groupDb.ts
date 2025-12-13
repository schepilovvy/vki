import { Group } from './entity/Group.entity';
import AppDataSource, { initializeDataSource } from './AppDataSource';
import type GroupInterface from '@/types/GroupInterface';
import type { Repository } from 'typeorm';

/**
 * Получение репозитория групп с проверкой соединения
 */
const getGroupRepository = async (): Promise<Repository<Group>> => {
  if (!AppDataSource.isInitialized) {
    await initializeDataSource();
  }
  return AppDataSource.getRepository(Group);
};

/**
 * Получение групп
 * @returns  Promise<GroupInterface[]>
 */
export const getGroupsDb = async (): Promise<GroupInterface[]> => {
  const groupRepository = await getGroupRepository();
  return await groupRepository.find();
};

/**
 * Добавление группы
 * @returns  Promise<GroupInterface>
 */
export const addGroupsDb = async (groupFields: Omit<GroupInterface, 'id'>): Promise<GroupInterface> => {
  if (!groupFields.teacherId) {
    throw new Error('Куратор обязателен для группы');
  }
  if (!groupFields.course || groupFields.course < 1 || groupFields.course > 4) {
    throw new Error('Курс должен быть от 1 до 4');
  }
  if (!groupFields.specialty) {
    throw new Error('Специальность обязательна для группы');
  }
  const groupRepository = await getGroupRepository();
  const group = new Group();
  const newGroup = await groupRepository.save({
    ...group,
    ...groupFields,
    course: groupFields.course,
    specialty: groupFields.specialty,
  });

  return newGroup;
};

/**
 * Удаление группы
 * @param groupId ИД удаляемой группы
 * @returns Promise<number>
 */
export const deleteGroupDb = async (groupId: number): Promise<number> => {
  const groupRepository = await getGroupRepository();
  await groupRepository.delete(groupId);
  return groupId;
};

/**
 * Обновление группы
 * @param groupId ИД группы
 * @param groupFields поля для обновления
 * @returns Promise<GroupInterface>
 */
export const updateGroupDb = async (groupId: number, groupFields: Partial<Omit<GroupInterface, 'id'>>): Promise<GroupInterface> => {
  const groupRepository = await getGroupRepository();
  await groupRepository.update(groupId, groupFields);
  const updatedGroup = await groupRepository.findOne({ where: { id: groupId } });
  if (!updatedGroup) {
    throw new Error('Группа не найдена');
  }
  return updatedGroup;
};

/**
 * Поиск групп по названию
 * @param searchQuery Поисковый запрос (поиск по названию группы)
 * @returns Promise<GroupInterface[]>
 */
export const searchGroupsDb = async (searchQuery: string): Promise<GroupInterface[]> => {
  const groupRepository = await getGroupRepository();
  const query = `%${searchQuery}%`;
  return await groupRepository
    .createQueryBuilder('group')
    .where('group.name LIKE :query', { query })
    .getMany();
};
