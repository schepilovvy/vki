import type TeacherInterface from '@/types/TeacherInterface';
import styles from './Teacher.module.scss';

interface Props {
  teacher: TeacherInterface;
  onDelete: (_teacherId: number) => void;
}

const Teacher = ({ teacher, onDelete }: Props): React.ReactElement => {
  const onDeleteHandler = (): void => {
    onDelete(teacher.id);
  };

  const modifier = teacher.isDeleted ? '--isDeleted' : teacher.isNew ? '--isNew' : '';

  return (
    <div className={`${styles.Teacher} ${styles[modifier]}`}>
      <div>
        {`${teacher.id || 'xxxx'} - ${teacher.lastName} ${teacher.firstName} ${teacher.middleName}`}
      </div>
      <button onClick={onDeleteHandler}>Удалить</button>
    </div>
  );
};

export default Teacher;
