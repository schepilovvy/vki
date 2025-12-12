'use client';

import useTeachers from '@/hooks/useTeachers';
import type TeacherInterface from '@/types/TeacherInterface';
import styles from './Teachers.module.scss';
import Teacher from './Teacher/Teacher';
import AddTeacher, { type FormFields } from './AddTeacher/AddTeacher';
import { v4 as uuidv4 } from 'uuid';

const Teachers = (): React.ReactElement => {
  const {
    teachers,
    deleteTeacherMutate,
    addTeacherMutate,
  } = useTeachers();

  /**
   * Удаление преподавателя - обработчик события нажатия "удалить"
   * @param teacherId Ид преподавателя
   */
  const onDeleteHandler = (teacherId: number): void => {
    if (confirm('Удалить преподавателя?')) {
      debugger;
      console.log('onDeleteHandler', teacherId);

      deleteTeacherMutate(teacherId);
    }
  };

  /**
   * Добавление преподавателя - обработчик события нажатия "добавить"
   * @param teacherFormField Форма преподавателя
   */
  const onAddHandler = (teacherFormField: FormFields): void => {
    debugger;
    console.log('Добавление преподавателя', teacherFormField);

    addTeacherMutate({
      id: -1,
      ...teacherFormField,
    });
  };

  return (
    <div className={styles.Teachers}>
      <AddTeacher onAdd={onAddHandler} />

      {teachers.filter((teacher: TeacherInterface) => !teacher.isDeleted).map((teacher: TeacherInterface) => (
        <Teacher
          key={teacher.id}
          teacher={teacher}
          onDelete={onDeleteHandler}
        />
      ))}
    </div>
  );
};

export default Teachers;

