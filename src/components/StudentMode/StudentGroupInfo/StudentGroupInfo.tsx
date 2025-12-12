'use client';

import useGroups from '@/hooks/useGroups';
import useStudents from '@/hooks/useStudents';
import type StudentInterface from '@/types/StudentInterface';
import styles from './StudentGroupInfo.module.scss';

interface Props {
  groupId: number;
}

const StudentGroupInfo = ({ groupId }: Props): React.ReactElement => {
  const { groups } = useGroups();
  const { students } = useStudents();
  const group = groups.find(g => g.id === groupId && !g.isDeleted);

  const groupStudents = students.filter((student: StudentInterface) => 
    !student.isDeleted && student.groupId === groupId
  );

  if (!group) {
    return (
      <div className={styles.StudentGroupInfo}>
        <p>Группа не найдена</p>
      </div>
    );
  }

  return (
    <div className={styles.StudentGroupInfo}>
      <div className={styles.groupCard}>
        <div className={styles.groupName}>{group.name}</div>
        {group.course && (
          <div className={styles.groupInfo}>
            <strong>Курс:</strong> {group.course}
          </div>
        )}
        {group.specialty && (
          <div className={styles.groupInfo}>
            <strong>Специальность:</strong> {group.specialty}
          </div>
        )}
      </div>

      <div className={styles.studentsSection}>
        <h3>Список студентов группы</h3>
        {groupStudents.length === 0 ? (
          <p className={styles.emptyStudents}>В группе нет студентов</p>
        ) : (
          <div className={styles.studentsList}>
            {groupStudents.map((student: StudentInterface) => (
              <div key={student.id} className={styles.studentItem}>
                {student.lastName} {student.firstName} {student.middleName}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentGroupInfo;

