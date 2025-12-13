import type GroupInterface from '@/types/GroupInterface';
import { useForm, type SubmitHandler } from 'react-hook-form';
import styles from './AddGroup.module.scss';
import useTeachers from '@/hooks/useTeachers';
import { SPECIALTIES } from '@/constants/specialties';

export type FormFields = {
  name: string;
  teacherId: number;
  course: number;
  specialty: string;
};

interface Props {
  onAdd: (groupForm: FormFields) => void;
}

const AddGroup = ({ onAdd }: Props): React.ReactElement => {
  const { teachers } = useTeachers();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = groupForm => onAdd(groupForm);

  return (
    <div className={styles.AddGroup}>
      <h2>Добавление группы</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <input
          placeholder="Название группы"
          {...register('name', { required: true })}
        />
        {errors.name && <div className={styles.errorMessage}>Обязательное поле</div>}

        <select
          {...register('course', { required: true, valueAsNumber: true, min: 1, max: 4 })}
        >
          <option value="">Выберите курс</option>
          {[1, 2, 3, 4].map(course => (
            <option key={course} value={course}>
              {course}
              {' '}
              курс
            </option>
          ))}
        </select>
        {errors.course && <div className={styles.errorMessage}>Обязательное поле (1-4 курс)</div>}

        <select
          {...register('specialty', { required: true })}
        >
          <option value="">Выберите специальность</option>
          {SPECIALTIES.map(specialty => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>
        {errors.specialty && <div className={styles.errorMessage}>Обязательное поле</div>}

        <select
          {...register('teacherId', { required: true, valueAsNumber: true })}
        >
          <option value="">Выберите куратора</option>
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

export default AddGroup;
