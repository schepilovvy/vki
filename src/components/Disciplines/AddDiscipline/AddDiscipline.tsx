import type DisciplineInterface from '@/types/DisciplineInterface';
import { useForm, type SubmitHandler } from 'react-hook-form';
import styles from './AddDiscipline.module.scss';
import useGroups from '@/hooks/useGroups';
import useTeachers from '@/hooks/useTeachers';

export type FormFields = Pick<DisciplineInterface, 'name' | 'groupId' | 'teacherId'>;

interface Props {
  onAdd: (formFields: FormFields) => void;
}

const AddDiscipline = ({ onAdd }: Props): React.ReactElement => {
  const { groups } = useGroups();
  const { teachers } = useTeachers();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = disciplineForm => onAdd(disciplineForm);

  return (
    <div className={styles.AddDiscipline}>
      <h2>Добавление дисциплины</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <input
          placeholder="Название дисциплины"
          {...register('name', { required: true })}
        />
        {errors.name && <div className={styles.errorMessage}>Обязательное поле</div>}

        <select
          {...register('groupId', { required: true, valueAsNumber: true })}
        >
          <option value="">Выберите группу</option>
          {groups.filter(g => !g.isDeleted).map(group => (
            <option key={group.id} value={group.id}>
              {group.name}
              {' '}
              {group.course && `(${group.course} курс)`}
            </option>
          ))}
        </select>
        {errors.groupId && <div className={styles.errorMessage}>Обязательное поле</div>}

        <select
          {...register('teacherId', { required: true, valueAsNumber: true })}
        >
          <option value="">Выберите преподавателя</option>
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
        {errors.teacherId && <div className={styles.errorMessage}>Обязательное поле</div>}

        <input type="submit" value="Добавить" />
      </form>

    </div>
  );
};

export default AddDiscipline;
