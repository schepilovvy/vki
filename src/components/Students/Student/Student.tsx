import type StudentInterface from '@/types/StudentInterface';
import styles from './Student.module.scss';

interface Props {
  student: StudentInterface;
  groupName?: string;
  onDelete: (id: number) => void;
}

const Student = ({ student, groupName, onDelete }: Props): React.ReactElement => {
  const onDeleteHandler = (): void => {
    onDelete(student.id);
  };

  const modifier = student.isDeleted ? '--isDeleted' : student.isNew ? '--isNew' : '';

  return (
    <div className={`${styles.Student} ${styles[modifier]}`}>
      <div>
        {`${student.id || 'xxxx'} - ${student.lastName} ${student.firstName} ${student.middleName}`}
        {groupName && <span className={styles.groupName}> (Группа: {groupName})</span>}
      </div>
      <button onClick={onDeleteHandler}>Удалить</button>
    </div>
  );
};

export default Student;
