'use client';

import { getGradesByStudentApi } from '@/api/gradesApi';
import { useQuery } from '@tanstack/react-query';
import useDisciplines from '@/hooks/useDisciplines';
import type GradeInterface from '@/types/GradeInterface';
import styles from './StudentGrades.module.scss';

interface Props {
  studentId: number;
}

const StudentGrades = ({ studentId }: Props): React.ReactElement => {
  const { disciplines } = useDisciplines();

  const { data: grades = [] } = useQuery<GradeInterface[]>({
    queryKey: ['grades', 'student', studentId],
    queryFn: () => getGradesByStudentApi(studentId),
    enabled: !!studentId,
  });

  const activeGrades = grades.filter((g: GradeInterface) => !g.isDeleted);

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

  // Группируем оценки по дисциплинам
  const gradesByDiscipline = activeGrades.reduce((acc, grade) => {
    const discipline = disciplines.find(d => d.id === grade.disciplineId);
    const disciplineName = discipline?.name || 'Неизвестная дисциплина';

    if (!acc[disciplineName]) {
      acc[disciplineName] = [];
    }
    acc[disciplineName].push(grade);
    return acc;
  }, {} as Record<string, GradeInterface[]>);

  if (activeGrades.length === 0) {
    return (
      <div className={styles.StudentGrades}>
        <p className={styles.empty}>У вас пока нет оценок</p>
      </div>
    );
  }

  return (
    <div className={styles.StudentGrades}>
      <div className={styles.gradesList}>
        {Object.entries(gradesByDiscipline).map(([disciplineName, disciplineGrades]) => (
          <div key={disciplineName} className={styles.disciplineGrades}>
            <h3 className={styles.disciplineName}>{disciplineName}</h3>
            <div className={styles.gradesRow}>
              {disciplineGrades.map((grade: GradeInterface) => (
                <div
                  key={grade.id}
                  className={styles.gradeBadge}
                  style={{ backgroundColor: getGradeColor(grade.grade) }}
                >
                  <span className={styles.gradeValue}>{grade.grade}</span>
                  {grade.date && (
                    <span className={styles.gradeDate}>{formatDate(grade.date)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentGrades;
