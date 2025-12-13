'use client';

import { useState, useEffect } from 'react';
import TeacherSelector from './TeacherSelector/TeacherSelector';
import TeacherGroups from './TeacherGroups/TeacherGroups';
import TeacherDisciplines from './TeacherDisciplines/TeacherDisciplines';
import useTeachers from '@/hooks/useTeachers';
import useAuth from '@/hooks/useAuth';
import styles from './TeacherMode.module.scss';

const TEACHER_ID_KEY = 'selectedTeacherId';

type TabType = 'curatorship' | 'disciplines';

interface Props {
  activeTab?: TabType;
}

const TeacherMode = ({ activeTab = 'curatorship' }: Props): React.ReactElement => {
  const { teachers } = useTeachers();
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);

  useEffect(() => {
    // Загружаем выбранного преподавателя из localStorage
    const savedTeacherId = localStorage.getItem(TEACHER_ID_KEY);
    if (savedTeacherId) {
      const teacherId = parseInt(savedTeacherId, 10);
      if (!isNaN(teacherId)) {
        setSelectedTeacherId(teacherId);
      }
    }
  }, []);

  const handleTeacherSelect = (teacherId: number): void => {
    setSelectedTeacherId(teacherId);
    localStorage.setItem(TEACHER_ID_KEY, teacherId.toString());
  };

  const { user } = useAuth();

  // Если у пользователя есть teacherId в токене, используем его
  useEffect(() => {
    if (user?.teacherId && !selectedTeacherId) {
      setSelectedTeacherId(user.teacherId);
      localStorage.setItem(TEACHER_ID_KEY, user.teacherId.toString());
    }
  }, [user, selectedTeacherId]);

  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);

  return (
    <div className={styles.TeacherMode}>
      {!user?.teacherId && (
        <TeacherSelector
          selectedTeacherId={selectedTeacherId}
          onSelect={handleTeacherSelect}
        />
      )}

      {selectedTeacherId && selectedTeacher && (
        <>
          <div className={styles.teacherInfo}>
            <h1>Преподаватель</h1>
            <p className={styles.teacherName}>
              {selectedTeacher.lastName}
              {' '}
              {selectedTeacher.firstName}
              {' '}
              {selectedTeacher.middleName}
            </p>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'curatorship' && (
              <TeacherGroups teacherId={selectedTeacherId} />
            )}
            {activeTab === 'disciplines' && (
              <TeacherDisciplines teacherId={selectedTeacherId} />
            )}
          </div>
        </>
      )}

      {selectedTeacherId && !selectedTeacher && (
        <div className={styles.error}>
          Преподаватель не найден
        </div>
      )}
    </div>
  );
};

export default TeacherMode;
