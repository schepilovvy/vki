'use client';

import { useState } from 'react';
import useGroups from '@/hooks/useGroups';
import useStudents from '@/hooks/useStudents';
import type GroupInterface from '@/types/GroupInterface';
import type StudentInterface from '@/types/StudentInterface';
import styles from './TeacherGroups.module.scss';

interface Props {
  teacherId: number;
}

const TeacherGroups = ({ teacherId }: Props): React.ReactElement => {
  const { groups } = useGroups();
  const { students } = useStudents();
  const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null);

  const curatorGroups = groups.filter((group: GroupInterface) =>
    !group.isDeleted && group.teacherId === teacherId,
  );

  const toggleGroup = (groupId: number): void => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
  };

  const getGroupStudents = (groupId: number): StudentInterface[] => {
    return students.filter((student: StudentInterface) =>
      !student.isDeleted && student.groupId === groupId,
    );
  };

  if (curatorGroups.length === 0) {
    return (
      <div className={styles.TeacherGroups}>
        <p className={styles.empty}>Вы не являетесь куратором ни одной группы</p>
      </div>
    );
  }

  return (
    <div className={styles.TeacherGroups}>
      <div className={styles.groupsList}>
        {curatorGroups.map((group: GroupInterface) => {
          const isExpanded = expandedGroupId === group.id;
          const groupStudents = getGroupStudents(group.id);
          return (
            <div key={group.id} className={styles.groupItem}>
              <div
                className={styles.groupHeader}
                onClick={() => toggleGroup(group.id)}
              >
                <div className={styles.groupInfo}>
                  <h3>{group.name}</h3>
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
                  <p className={styles.studentsCount}>
                    <strong>Студентов:</strong>
                    {' '}
                    {groupStudents.length}
                  </p>
                </div>
                <span className={styles.toggleIcon}>{isExpanded ? '▼' : '▶'}</span>
              </div>
              {isExpanded && (
                <div className={styles.studentsList}>
                  {groupStudents.length === 0
                    ? (
                      <p className={styles.emptyStudents}>В группе нет студентов</p>
                    )
                    : (
                      <>
                        <h4>Список студентов:</h4>
                        <ul>
                          {groupStudents.map((student: StudentInterface) => (
                            <li key={student.id} className={styles.studentItem}>
                              {student.lastName}
                              {' '}
                              {student.firstName}
                              {' '}
                              {student.middleName}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherGroups;
