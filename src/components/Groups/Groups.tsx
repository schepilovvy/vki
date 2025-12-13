'use client';

import useGroups from '@/hooks/useGroups';
import useTeachers from '@/hooks/useTeachers';
import type GroupInterface from '@/types/GroupInterface';
import styles from './Groups.module.scss';
import AddGroup, { type FormFields } from './AddGroup/AddGroup';

const Groups = (): React.ReactElement => {
  const { groups, addGroupMutate, deleteGroupMutate, updateGroupMutate } = useGroups();
  const { teachers } = useTeachers();

  /**
   * Добавление группы - обработчик события нажатия "добавить"
   * @param groupFormField Форма группы
   */
  const onAddHandler = (groupFormField: FormFields): void => {
    debugger;
    console.log('Добавление группы', groupFormField);

    addGroupMutate({
      ...groupFormField,
    });
  };

  /**
   * Удаление группы - обработчик события нажатия "удалить"
   * @param groupId Ид группы
   */
  const onDeleteHandler = (groupId: number): void => {
    if (confirm('Удалить группу?')) {
      debugger;
      console.log('onDeleteHandler', groupId);

      deleteGroupMutate(groupId);
    }
  };

  /**
   * Изменение куратора группы
   * @param groupId Ид группы
   * @param teacherId Ид преподавателя (куратора)
   */
  const onCuratorChangeHandler = (groupId: number, teacherId: number | undefined): void => {
    debugger;
    console.log('Изменение куратора группы', groupId, teacherId);

    if (!teacherId) {
      alert('Куратор обязателен для группы');
      return;
    }

    updateGroupMutate(groupId, { teacherId });
  };

  return (
    <div className={styles.Groups}>
      <AddGroup onAdd={onAddHandler} />

      <div className={styles.groupsList}>
        {groups.filter((group: GroupInterface) => !group.isDeleted).map((group: GroupInterface) => {
          const curator = teachers.find(t => t.id === group.teacherId);
          return (
            <div key={group.id} className={styles.groupItem}>
              <div className={styles.groupHeader}>
                <h3>{group.name}</h3>
                <button
                  onClick={() => onDeleteHandler(group.id)}
                  className={styles.deleteButton}
                >
                  Удалить
                </button>
              </div>
              {group.course && group.specialty && (
                <div className={styles.groupInfo}>
                  <p>
                    <strong>Курс:</strong>
                    {' '}
                    {group.course}
                  </p>
                  <p>
                    <strong>Специальность:</strong>
                    {' '}
                    {group.specialty}
                  </p>
                </div>
              )}
              <div className={styles.curatorSection}>
                <label htmlFor={`curator-${group.id}`}>Куратор:</label>
                <select
                  id={`curator-${group.id}`}
                  value={group.teacherId || ''}
                  onChange={e => onCuratorChangeHandler(group.id, e.target.value ? parseInt(e.target.value, 10) : undefined)}
                  className={styles.curatorSelect}
                >
                  <option value="">Выберите куратора</option>
                  {teachers.filter(t => !t.isDeleted).map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.lastName}
                      {' '}
                      {teacher.firstName}
                      {' '}
                      {teacher.middleName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Groups;
