'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@/api/searchApi';
import { getGradesByStudentApi } from '@/api/gradesApi';
import type StudentInterface from '@/types/StudentInterface';
import type TeacherInterface from '@/types/TeacherInterface';
import type GroupInterface from '@/types/GroupInterface';
import type DisciplineInterface from '@/types/DisciplineInterface';
import type GradeInterface from '@/types/GradeInterface';
import useGroups from '@/hooks/useGroups';
import useTeachers from '@/hooks/useTeachers';
import useDisciplines from '@/hooks/useDisciplines';
import styles from './Search.module.scss';

type SearchType = 'student' | 'teacher' | 'group' | 'discipline';

const Search = (): React.ReactElement => {
  const [searchType, setSearchType] = useState<SearchType>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const { groups } = useGroups();
  const { teachers } = useTeachers();
  const { disciplines } = useDisciplines();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', searchType, searchQuery],
    queryFn: () => searchApi(searchType, searchQuery),
    enabled: searchQuery.trim().length > 0,
  });

  const StudentGrades = ({ studentId }: { studentId: number }): React.ReactElement => {
    const { data: grades = [] } = useQuery<GradeInterface[]>({
      queryKey: ['grades', 'student', studentId],
      queryFn: () => getGradesByStudentApi(studentId),
      enabled: !!studentId,
    });

    const activeGrades = grades.filter((g: GradeInterface) => !g.isDeleted);

    if (activeGrades.length === 0) {
      return <p className={styles.emptySection}>Оценок нет</p>;
    }

    const gradesByDiscipline = activeGrades.reduce((acc, grade) => {
      const discipline = disciplines.find(d => d.id === grade.disciplineId);
      const disciplineName = discipline?.name || 'Неизвестная дисциплина';

      if (!acc[disciplineName]) {
        acc[disciplineName] = [];
      }
      acc[disciplineName].push(grade);
      return acc;
    }, {} as Record<string, GradeInterface[]>);

    const getGradeColor = (grade: number): string => {
      switch (grade) {
        case 2:
          return '#e74c3c';
        case 3:
          return '#f39c12';
        case 4:
          return '#3498db';
        case 5:
          return '#27ae60';
        default:
          return '#95a5a6';
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
      <div className={styles.gradesSection}>
        <h4>Оценки:</h4>
        {Object.entries(gradesByDiscipline).map(([disciplineName, disciplineGrades]) => (
          <div key={disciplineName} className={styles.disciplineGrades}>
            <strong>
              {disciplineName}
              :
            </strong>
            <div className={styles.gradesList}>
              {disciplineGrades.map(grade => (
                <span
                  key={grade.id}
                  className={styles.gradeBadge}
                  style={{ backgroundColor: getGradeColor(grade.grade) }}
                >
                  {grade.grade}
                  {' '}
                  {grade.date && `(${formatDate(grade.date)})`}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStudentResult = (student: StudentInterface): React.ReactElement => {
    const group = groups.find(g => g.id === student.groupId);
    return (
      <div key={student.id} className={styles.resultItem}>
        <div className={styles.resultHeader}>
          <strong>Студент</strong>
          <span className={styles.resultId}>
            ID:
            {student.id}
          </span>
        </div>
        <div className={styles.resultContent}>
          <p>
            <strong>ФИО:</strong>
            {' '}
            {student.lastName}
            {' '}
            {student.firstName}
            {' '}
            {student.middleName}
          </p>
          {group && (
            <p>
              <strong>Группа:</strong>
              {' '}
              {group.name}
            </p>
          )}
          {student.contacts && (
            <p>
              <strong>Контакты:</strong>
              {' '}
              {student.contacts}
            </p>
          )}
          <StudentGrades studentId={student.id} />
        </div>
      </div>
    );
  };

  const renderTeacherResult = (teacher: TeacherInterface): React.ReactElement => {
    const teacherDisciplines = disciplines.filter((d: DisciplineInterface) =>
      !d.isDeleted && d.teacherId === teacher.id,
    );
    const curatorGroups = groups.filter((g: GroupInterface) =>
      !g.isDeleted && g.teacherId === teacher.id,
    );

    return (
      <div key={teacher.id} className={styles.resultItem}>
        <div className={styles.resultHeader}>
          <strong>Преподаватель</strong>
          <span className={styles.resultId}>
            ID:
            {teacher.id}
          </span>
        </div>
        <div className={styles.resultContent}>
          <p>
            <strong>ФИО:</strong>
            {' '}
            {teacher.lastName}
            {' '}
            {teacher.firstName}
            {' '}
            {teacher.middleName}
          </p>
          {teacher.contacts && (
            <p>
              <strong>Контакты:</strong>
              {' '}
              {teacher.contacts}
            </p>
          )}

          {teacherDisciplines.length > 0 && (
            <div className={styles.section}>
              <h4>
                Дисциплины (
                {teacherDisciplines.length}
                ):
              </h4>
              <ul className={styles.list}>
                {teacherDisciplines.map((discipline: DisciplineInterface) => {
                  const group = groups.find(g => g.id === discipline.groupId);
                  return (
                    <li key={discipline.id}>
                      {discipline.name}
                      {group && (
                        <span className={styles.groupTag}>
                          {' '}
                          (
                          {group.name}
                          )
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {curatorGroups.length > 0 && (
            <div className={styles.section}>
              <h4>
                Кураторские группы (
                {curatorGroups.length}
                ):
              </h4>
              <ul className={styles.list}>
                {curatorGroups.map((group: GroupInterface) => (
                  <li key={group.id}>
                    {group.name}
                    {group.course && (
                      <span className={styles.groupTag}>
                        {' '}
                        (Курс
                        {group.course}
                        )
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {teacherDisciplines.length === 0 && curatorGroups.length === 0 && (
            <p className={styles.emptySection}>Нет дисциплин и кураторских групп</p>
          )}
        </div>
      </div>
    );
  };

  const renderGroupResult = (group: GroupInterface): React.ReactElement => {
    const curator = teachers.find(t => t.id === group.teacherId);
    return (
      <div key={group.id} className={styles.resultItem}>
        <div className={styles.resultHeader}>
          <strong>Группа</strong>
          <span className={styles.resultId}>
            ID:
            {group.id}
          </span>
        </div>
        <div className={styles.resultContent}>
          <p>
            <strong>Название:</strong>
            {' '}
            {group.name}
          </p>
          {group.course && (
            <p>
              <strong>Курс:</strong>
              {' '}
              {group.course}
            </p>
          )}
          {group.specialty && (
            <p>
              <strong>Специальность:</strong>
              {' '}
              {group.specialty}
            </p>
          )}
          {curator && (
            <p>
              <strong>Куратор:</strong>
              {' '}
              {curator.lastName}
              {' '}
              {curator.firstName}
              {' '}
              {curator.middleName}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderDisciplineResult = (discipline: DisciplineInterface): React.ReactElement => {
    const group = groups.find(g => g.id === discipline.groupId);
    const teacher = teachers.find(t => t.id === discipline.teacherId);
    return (
      <div key={discipline.id} className={styles.resultItem}>
        <div className={styles.resultHeader}>
          <strong>Дисциплина</strong>
          <span className={styles.resultId}>
            ID:
            {discipline.id}
          </span>
        </div>
        <div className={styles.resultContent}>
          <p>
            <strong>Название:</strong>
            {' '}
            {discipline.name}
          </p>
          {group && (
            <p>
              <strong>Группа:</strong>
              {' '}
              {group.name}
            </p>
          )}
          {teacher && (
            <p>
              <strong>Преподаватель:</strong>
              {' '}
              {teacher.lastName}
              {' '}
              {teacher.firstName}
              {' '}
              {teacher.middleName}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderResults = (): React.ReactElement | null => {
    if (!searchQuery.trim()) {
      return null;
    }

    if (isLoading) {
      return <div className={styles.loading}>Поиск...</div>;
    }

    if (!searchResults || searchResults.length === 0) {
      return <div className={styles.noResults}>Ничего не найдено</div>;
    }

    return (
      <div className={styles.results}>
        <h3>
          Результаты поиска (
          {searchResults.length}
          )
        </h3>
        {searchResults.map((result: unknown) => {
          switch (searchType) {
            case 'student':
              return renderStudentResult(result as StudentInterface);
            case 'teacher':
              return renderTeacherResult(result as TeacherInterface);
            case 'group':
              return renderGroupResult(result as GroupInterface);
            case 'discipline':
              return renderDisciplineResult(result as DisciplineInterface);
            default:
              return null;
          }
        })}
      </div>
    );
  };

  return (
    <div className={styles.Search}>
      <div className={styles.searchForm}>
        <h2>Поиск</h2>

        <div className={styles.formRow}>
          <label htmlFor="searchType">Тип:</label>
          <select
            id="searchType"
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value as SearchType);
              setSearchQuery('');
            }}
            className={styles.select}
          >
            <option value="student">Студент</option>
            <option value="teacher">Преподаватель</option>
            <option value="group">Группа</option>
            <option value="discipline">Дисциплина</option>
          </select>
        </div>

        <div className={styles.formRow}>
          <label htmlFor="searchQuery">Имя:</label>
          <input
            id="searchQuery"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              searchType === 'student' || searchType === 'teacher'
                ? 'Введите ФИО...'
                : 'Введите название...'
            }
            className={styles.input}
          />
        </div>
      </div>

      {renderResults()}
    </div>
  );
};

export default Search;
