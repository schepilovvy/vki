'use client';

import useStudents from '@/hooks/useStudents';
import useGroups from '@/hooks/useGroups';
import type StudentInterface from '@/types/StudentInterface';
import styles from './Students.module.scss';
import Student from './Student/Student';
import AddStudent, { type FormFields } from './AddStudent/AddStudent';
import { v4 as uuidv4 } from 'uuid';

const Students = (): React.ReactElement => {
  const {
    students,
    deleteStudentMutate,
    addStudentMutate,
  } = useStudents();
  const { groups } = useGroups();

  /**
   * Удаление студента - обработчик события нажатия "удалить"
   * @param studentId Ид студента
   */
  const onDeleteHandler = (studentId: number): void => {
    if (confirm('Удалить студента?')) {
      debugger;
      console.log('onDeleteHandler', studentId);

      deleteStudentMutate(studentId);
    }
  };

  /**
   * Добавления студента - обработчик события нажатия "добавить"
   * @param studentFormField Форма студента
   */
  const onAddHandler = (studentFormField: FormFields): void => {
    debugger;
    console.log('Добавление студента', studentFormField);

    addStudentMutate({
      id: -1,
      ...studentFormField,
      uuid: uuidv4(),
    });
  };

  return (
    <div className={styles.Students}>
      <AddStudent onAdd={onAddHandler} />

      {students.map((student: StudentInterface) => {
        const group = groups.find(g => g.id === student.groupId);
        return (
          <Student
            key={student.id || student.uuid}
            student={student}
            groupName={group?.name}
            onDelete={onDeleteHandler}
          />
        );
      })}
    </div>
  );
};

export default Students;
