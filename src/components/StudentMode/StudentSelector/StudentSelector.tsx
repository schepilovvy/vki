'use client';

import useStudents from '@/hooks/useStudents';
import styles from './StudentSelector.module.scss';

interface Props {
  selectedStudentId: number | null;
  onSelect: (studentId: number) => void;
}

const StudentSelector = ({ selectedStudentId, onSelect }: Props): React.ReactElement => {
  const { students } = useStudents();

  return (
    <div className={styles.StudentSelector}>
      <h2>Выберите студента</h2>
      <select
        value={selectedStudentId || ''}
        onChange={e => onSelect(parseInt(e.target.value, 10))}
        className={styles.select}
      >
        <option value="">-- Выберите студента --</option>
        {students.filter(s => !s.isDeleted).map(student => (
          <option key={student.id} value={student.id}>
            {student.lastName}
            {' '}
            {student.firstName}
            {' '}
            {student.middleName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StudentSelector;
