'use client';

import useHomeworks from '@/hooks/useHomeworks';
import type HomeworkInterface from '@/types/HomeworkInterface';
import styles from './HomeworkList.module.scss';

interface Props {
  disciplineId: number;
  onDelete?: (homeworkId: number) => void;
}

const HomeworkList = ({ disciplineId, onDelete }: Props): React.ReactElement => {
  const { homeworks, deleteHomeworkMutate } = useHomeworks(disciplineId);

  const handleDelete = (homeworkId: number): void => {
    if (confirm('Удалить домашнее задание?')) {
      if (onDelete) {
        onDelete(homeworkId);
      }
      else {
        deleteHomeworkMutate(homeworkId);
      }
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Не указано';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    catch {
      return dateString;
    }
  };

  if (homeworks.length === 0) {
    return (
      <div className={styles.HomeworkList}>
        <p className={styles.empty}>Нет назначенных домашних заданий</p>
      </div>
    );
  }

  return (
    <div className={styles.HomeworkList}>
      <h4>Домашние задания:</h4>
      <div className={styles.homeworks}>
        {homeworks.filter(h => !h.isDeleted).map((homework: HomeworkInterface) => (
          <div key={homework.id} className={styles.homeworkItem}>
            {homework.title && (
              <div className={styles.homeworkTitle}>{homework.title}</div>
            )}
            <div className={styles.homeworkDescription}>{homework.description}</div>
            <div className={styles.homeworkMeta}>
              <span className={styles.dueDate}>
                Срок:
                {' '}
                {formatDate(homework.dueDate)}
              </span>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(homework.id)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeworkList;
