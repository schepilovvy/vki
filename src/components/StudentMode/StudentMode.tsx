'use client';

import { useState, useEffect } from 'react';
import StudentSelector from './StudentSelector/StudentSelector';
import StudentGroupInfo from './StudentGroupInfo/StudentGroupInfo';
import StudentDisciplines from './StudentDisciplines/StudentDisciplines';
import StudentGrades from './StudentGrades/StudentGrades';
import useStudents from '@/hooks/useStudents';
import useAuth from '@/hooks/useAuth';
import styles from './StudentMode.module.scss';

const STUDENT_ID_KEY = 'selectedStudentId';

type TabType = 'group' | 'disciplines' | 'grades';

interface Props {
  activeTab?: TabType;
}

const StudentMode = ({ activeTab = 'group' }: Props): React.ReactElement => {
  const { students, isLoading: isStudentsLoading } = useStudents();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  // Если у пользователя есть studentId в токене, используем его (приоритет над localStorage)
  useEffect(() => {
    if (!isAuthLoading && user?.studentId) {
      setSelectedStudentId(user.studentId);
      localStorage.setItem(STUDENT_ID_KEY, user.studentId.toString());
    }
    else if (!isAuthLoading && !user?.studentId) {
      // Если нет studentId в токене, пробуем загрузить из localStorage
      const savedStudentId = localStorage.getItem(STUDENT_ID_KEY);
      if (savedStudentId) {
        const studentId = parseInt(savedStudentId, 10);
        if (!isNaN(studentId)) {
          setSelectedStudentId(studentId);
        }
      }
    }
  }, [user, isAuthLoading]);

  const handleStudentSelect = (studentId: number): void => {
    setSelectedStudentId(studentId);
    localStorage.setItem(STUDENT_ID_KEY, studentId.toString());
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId && !s.isDeleted);

  // Отладочная информация
  useEffect(() => {
    if (selectedStudentId && !selectedStudent) {
      console.error('Student not found:', {
        selectedStudentId,
        totalStudents: students.length,
        studentIds: students.map(s => s.id),
        userStudentId: user?.studentId,
      });
    }
  }, [selectedStudentId, selectedStudent, students, user]);

  // Показываем загрузку, пока не загрузились данные аутентификации или список студентов
  if (isAuthLoading || isStudentsLoading) {
    return (
      <div className={styles.StudentMode}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={styles.StudentMode}>
      {!user?.studentId && (
        <StudentSelector
          selectedStudentId={selectedStudentId}
          onSelect={handleStudentSelect}
        />
      )}

      {selectedStudentId && selectedStudent && (
        <>
          <div className={styles.studentInfo}>
            <h1>Студент</h1>
            <p className={styles.studentName}>
              {selectedStudent.lastName}
              {' '}
              {selectedStudent.firstName}
              {' '}
              {selectedStudent.middleName}
            </p>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'group' && (
              <StudentGroupInfo groupId={selectedStudent.groupId} />
            )}
            {activeTab === 'disciplines' && (
              <StudentDisciplines groupId={selectedStudent.groupId} />
            )}
            {activeTab === 'grades' && (
              <StudentGrades studentId={selectedStudent.id} />
            )}
          </div>
        </>
      )}

      {selectedStudentId && !selectedStudent && (
        <div className={styles.error}>
          <h3>Студент не найден</h3>
          <p>
            ID студента из токена:
            {selectedStudentId}
          </p>
          <p>
            Всего студентов в системе:
            {students.length}
          </p>
          <p>Возможные причины:</p>
          <ul>
            <li>Студент был удален из системы</li>
            <li>Связь между пользователем и студентом неверна</li>
            <li>Студент еще не создан в системе</li>
          </ul>
          <p>Обратитесь к администратору для исправления проблемы.</p>
        </div>
      )}
    </div>
  );
};

export default StudentMode;
