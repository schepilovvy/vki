'use client';

import { useState } from 'react';
import useStudents from '@/hooks/useStudents';
import useGrades from '@/hooks/useGrades';
import type StudentInterface from '@/types/StudentInterface';
import type GradeInterface from '@/types/GradeInterface';
import styles from './GradesModal.module.scss';

interface Props {
  disciplineId: number;
  disciplineName: string;
  groupId: number;
  onClose: () => void;
}

const GradesModal = ({ disciplineId, disciplineName, groupId, onClose }: Props): React.ReactElement => {
  const { students } = useStudents();
  const { grades, addGradeMutate, deleteGradeMutate } = useGrades(disciplineId);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [gradeValue, setGradeValue] = useState<string>('');
  const [gradeDate, setGradeDate] = useState<string>(() => {
    // Устанавливаем текущую дату по умолчанию в формате YYYY-MM-DD
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Получаем студентов из группы
  const groupStudents = students.filter((student: StudentInterface) => 
    !student.isDeleted && student.groupId === groupId
  );

  const handleSubmitGrade = (studentId: number): void => {
    const grade = parseInt(gradeValue, 10);
    if (isNaN(grade) || grade < 2 || grade > 5) {
      alert('Оценка должна быть от 2 до 5');
      return;
    }

    if (!gradeDate) {
      alert('Выберите дату');
      return;
    }

    // Преобразуем дату в ISO строку (устанавливаем время на начало дня)
    const selectedDate = new Date(gradeDate);
    selectedDate.setHours(0, 0, 0, 0);

    addGradeMutate({
      id: -1,
      studentId,
      disciplineId,
      grade,
      date: selectedDate.toISOString(),
    });

    setSelectedStudentId(null);
    setGradeValue('');
    // Сбрасываем дату на текущую
    const today = new Date();
    setGradeDate(today.toISOString().split('T')[0]);
  };

  const getStudentGrades = (studentId: number): GradeInterface[] => {
    return grades.filter((grade: GradeInterface) => 
      !grade.isDeleted && grade.studentId === studentId
    );
  };

  const handleDeleteGrade = (gradeId: number): void => {
    if (confirm('Удалить оценку?')) {
      deleteGradeMutate(gradeId);
    }
  };

  const getGradeColor = (grade: number): string => {
    switch (grade) {
      case 2:
        return '#e74c3c'; // красный
      case 3:
        return '#f39c12'; // оранжевый
      case 4:
        return '#3498db'; // голубой
      case 5:
        return '#27ae60'; // зеленый
      default:
        return '#95a5a6'; // серый по умолчанию
    }
  };

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
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Оценки по дисциплине: {disciplineName}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalBody}>
          {groupStudents.length === 0 ? (
            <p className={styles.empty}>В группе нет студентов</p>
          ) : (
            <div className={styles.studentsList}>
              {groupStudents.map((student: StudentInterface) => {
                const studentGrades = getStudentGrades(student.id);
                const isSelected = selectedStudentId === student.id;
                return (
                  <div key={student.id} className={styles.studentItem}>
                    <div className={styles.studentInfo}>
                      <div className={styles.studentName}>
                        {student.lastName} {student.firstName} {student.middleName}
                      </div>
                      {studentGrades.length > 0 && (
                        <div className={styles.gradesList}>
                          <strong>Оценки:</strong>
                          {studentGrades.map((grade: GradeInterface) => (
                            <span
                              key={grade.id}
                              className={styles.gradeBadge}
                              style={{ backgroundColor: getGradeColor(grade.grade) }}
                            >
                              {grade.grade}
                              {grade.date && (
                                <span className={styles.gradeDate}>
                                  {' '}({formatDate(grade.date)})
                                </span>
                              )}
                              <button
                                className={styles.deleteGradeButton}
                                onClick={() => handleDeleteGrade(grade.id)}
                                title="Удалить оценку"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {isSelected ? (
                      <div className={styles.gradeForm}>
                        <select
                          value={gradeValue}
                          onChange={(e) => setGradeValue(e.target.value)}
                          className={styles.gradeSelect}
                        >
                          <option value="">Выберите оценку</option>
                          {[2, 3, 4, 5].map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                        <input
                          type="date"
                          value={gradeDate}
                          onChange={(e) => setGradeDate(e.target.value)}
                          className={styles.dateInput}
                        />
                        <div className={styles.formActions}>
                          <button
                            onClick={() => handleSubmitGrade(student.id)}
                            className={styles.submitButton}
                            disabled={!gradeValue || !gradeDate}
                          >
                            Поставить
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStudentId(null);
                              setGradeValue('');
                              const today = new Date();
                              setGradeDate(today.toISOString().split('T')[0]);
                            }}
                            className={styles.cancelButton}
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedStudentId(student.id)}
                        className={styles.addGradeButton}
                      >
                        Поставить оценку
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradesModal;

