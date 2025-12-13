'use client';

import useTeachers from '@/hooks/useTeachers';
import styles from './TeacherSelector.module.scss';

interface Props {
  selectedTeacherId: number | null;
  onSelect: (teacherId: number) => void;
}

const TeacherSelector = ({ selectedTeacherId, onSelect }: Props): React.ReactElement => {
  const { teachers } = useTeachers();

  return (
    <div className={styles.TeacherSelector}>
      <h2>Выберите преподавателя</h2>
      <select
        value={selectedTeacherId || ''}
        onChange={e => onSelect(parseInt(e.target.value, 10))}
        className={styles.select}
      >
        <option value="">-- Выберите преподавателя --</option>
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
  );
};

export default TeacherSelector;
