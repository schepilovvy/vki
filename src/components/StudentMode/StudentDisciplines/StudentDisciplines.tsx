'use client';

import { useState } from 'react';
import { getDisciplinesByGroupApi } from '@/api/disciplinesApi';
import { useQuery } from '@tanstack/react-query';
import useHomeworks from '@/hooks/useHomeworks';
import type DisciplineInterface from '@/types/DisciplineInterface';
import type HomeworkInterface from '@/types/HomeworkInterface';
import styles from './StudentDisciplines.module.scss';

interface Props {
  groupId: number;
}

const StudentDisciplines = ({ groupId }: Props): React.ReactElement => {
  const [expandedDisciplineId, setExpandedDisciplineId] = useState<number | null>(null);

  const { data: disciplines = [] } = useQuery<DisciplineInterface[]>({
    queryKey: ['disciplines', 'group', groupId],
    queryFn: () => getDisciplinesByGroupApi(groupId),
    enabled: !!groupId,
  });

  const activeDisciplines = disciplines.filter((d: DisciplineInterface) => !d.isDeleted);

  const toggleDiscipline = (disciplineId: number): void => {
    setExpandedDisciplineId(expandedDisciplineId === disciplineId ? null : disciplineId);
  };

  if (activeDisciplines.length === 0) {
    return (
      <div className={styles.StudentDisciplines}>
        <p className={styles.empty}>У вас нет назначенных дисциплин</p>
      </div>
    );
  }

  return (
    <div className={styles.StudentDisciplines}>
      <div className={styles.disciplinesList}>
        {activeDisciplines.map((discipline: DisciplineInterface) => {
          const isExpanded = expandedDisciplineId === discipline.id;
          return (
            <DisciplineItem
              key={discipline.id}
              discipline={discipline}
              isExpanded={isExpanded}
              onToggle={() => toggleDiscipline(discipline.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

interface DisciplineItemProps {
  discipline: DisciplineInterface;
  isExpanded: boolean;
  onToggle: () => void;
}

const DisciplineItem = ({ discipline, isExpanded, onToggle }: DisciplineItemProps): React.ReactElement => {
  const { homeworks } = useHomeworks(isExpanded ? discipline.id : null);
  const activeHomeworks = homeworks.filter((h: HomeworkInterface) => !h.isDeleted);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU');
    }
    catch {
      return dateString;
    }
  };

  return (
    <div className={styles.disciplineItem}>
      <div className={styles.disciplineHeader} onClick={onToggle}>
        <h3 className={styles.disciplineTitle}>{discipline.name}</h3>
        <span className={styles.toggleIcon}>{isExpanded ? '▼' : '▶'}</span>
      </div>
      {isExpanded && (
        <div className={styles.disciplineContent}>
          {activeHomeworks.length === 0 ? (
            <p className={styles.emptyHomeworks}>Нет заданий</p>
          ) : (
            <div className={styles.homeworksList}>
              <h4>Домашние задания:</h4>
              {activeHomeworks.map((homework: HomeworkInterface) => (
                <div key={homework.id} className={styles.homeworkItem}>
                  <div className={styles.homeworkTitle}>{homework.title}</div>
                  {homework.description && (
                    <div className={styles.homeworkDescription}>{homework.description}</div>
                  )}
                  {homework.dueDate && (
                    <div className={styles.homeworkDueDate}>
                      <strong>Срок сдачи:</strong> {formatDate(homework.dueDate)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDisciplines;

