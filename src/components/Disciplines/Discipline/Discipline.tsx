import type DisciplineInterface from '@/types/DisciplineInterface';
import styles from './Discipline.module.scss';
import useGroups from '@/hooks/useGroups';
import useTeachers from '@/hooks/useTeachers';

interface Props {
  discipline: DisciplineInterface;
  onDelete: (id: number) => void;
}

const Discipline = ({ discipline, onDelete }: Props): React.ReactElement => {
  const { groups } = useGroups();
  const { teachers } = useTeachers();
  const onDeleteHandler = (): void => {
    onDelete(discipline.id);
  };

  const modifier = discipline.isDeleted ? '--isDeleted' : discipline.isNew ? '--isNew' : '';
  const group = groups.find(g => g.id === discipline.groupId);
  const teacher = teachers.find(t => t.id === discipline.teacherId);

  return (
    <div className={`${styles.Discipline} ${styles[modifier]}`}>
      <div className={styles.disciplineInfo}>
        <div className={styles.disciplineName}>
          <strong>{discipline.name}</strong>
        </div>
        <div className={styles.disciplineDetails}>
          {group && (
            <span className={styles.group}>
              Группа:
              {' '}
              {group.name}
              {' '}
              {group.course && `(${group.course} курс)`}
            </span>
          )}
          {teacher && (
            <span className={styles.teacher}>
              Преподаватель:
              {' '}
              {teacher.lastName}
              {' '}
              {teacher.firstName}
              {' '}
              {teacher.middleName}
            </span>
          )}
        </div>
      </div>
      <button onClick={onDeleteHandler}>Удалить</button>
    </div>
  );
};

export default Discipline;
