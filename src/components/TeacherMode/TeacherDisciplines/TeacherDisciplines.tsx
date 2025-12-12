'use client';

import { useState } from 'react';
import useDisciplines from '@/hooks/useDisciplines';
import useGroups from '@/hooks/useGroups';
import useHomeworks from '@/hooks/useHomeworks';
import type DisciplineInterface from '@/types/DisciplineInterface';
import styles from './TeacherDisciplines.module.scss';
import AddHomeworkModal, { type FormFields } from '../AddHomeworkModal/AddHomeworkModal';
import GradesModal from '../GradesModal/GradesModal';

interface Props {
  teacherId: number;
}

const TeacherDisciplines = ({ teacherId }: Props): React.ReactElement => {
  const { disciplines } = useDisciplines();
  const { groups } = useGroups();
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<number | null>(null);
  const [gradesModalDiscipline, setGradesModalDiscipline] = useState<{ id: number; name: string; groupId: number } | null>(null);

  const teacherDisciplines = disciplines.filter((discipline: DisciplineInterface) => 
    !discipline.isDeleted && discipline.teacherId === teacherId
  );

  // Используем хук для добавления домашних заданий
  // Используем первую дисциплину или null для инициализации хука
  const { addHomeworkMutate } = useHomeworks(teacherDisciplines[0]?.id || null);

  const handleDisciplineClick = (discipline: DisciplineInterface): void => {
    // При клике на дисциплину открываем модальное окно с оценками
    setGradesModalDiscipline({
      id: discipline.id,
      name: discipline.name,
      groupId: discipline.groupId,
    });
  };

  const handleAddHomework = (disciplineId: number): void => {
    setSelectedDisciplineId(disciplineId);
  };

  const handleCloseModal = (): void => {
    setSelectedDisciplineId(null);
  };

  const handleCloseGradesModal = (): void => {
    setGradesModalDiscipline(null);
  };

  const handleSubmitHomework = (homework: FormFields & { disciplineId: number }): void => {
    addHomeworkMutate({
      id: -1,
      ...homework,
    });
    setSelectedDisciplineId(null);
  };

  if (teacherDisciplines.length === 0) {
    return (
      <div className={styles.TeacherDisciplines}>
        <h2>Мои дисциплины</h2>
        <p className={styles.empty}>У вас нет назначенных дисциплин</p>
      </div>
    );
  }

  return (
    <div className={styles.TeacherDisciplines}>
      <h2>Мои дисциплины</h2>
      <div className={styles.disciplinesList}>
        {teacherDisciplines.map((discipline: DisciplineInterface) => {
          const group = groups.find(g => g.id === discipline.groupId);
          return (
            <div key={discipline.id} className={styles.disciplineItem}>
              <div 
                className={styles.disciplineHeader}
                onClick={() => handleDisciplineClick(discipline)}
              >
                <h3 className={styles.disciplineTitle}>{discipline.name}</h3>
                <div className={styles.actions}>
                  <button 
                    className={styles.gradesButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setGradesModalDiscipline({
                        id: discipline.id,
                        name: discipline.name,
                        groupId: discipline.groupId,
                      });
                    }}
                  >
                    Оценки
                  </button>
                  <button 
                    className={styles.addHomeworkButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddHomework(discipline.id);
                    }}
                  >
                    Назначить задание
                  </button>
                </div>
              </div>
              {group && (
                <div className={styles.groupInfo}>
                  <p><strong>Группа:</strong> {group.name}</p>
                  {group.course && <p><strong>Курс:</strong> {group.course}</p>}
                  {group.specialty && <p><strong>Специальность:</strong> {group.specialty}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDisciplineId && (
        <AddHomeworkModal
          disciplineId={selectedDisciplineId}
          disciplineName={teacherDisciplines.find(d => d.id === selectedDisciplineId)?.name || ''}
          onAdd={handleSubmitHomework}
          onClose={handleCloseModal}
        />
      )}

      {gradesModalDiscipline && (
        <GradesModal
          disciplineId={gradesModalDiscipline.id}
          disciplineName={gradesModalDiscipline.name}
          groupId={gradesModalDiscipline.groupId}
          onClose={handleCloseGradesModal}
        />
      )}
    </div>
  );
};

export default TeacherDisciplines;

