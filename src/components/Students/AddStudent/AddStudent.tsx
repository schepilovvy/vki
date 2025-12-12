import type StudentInterface from '@/types/StudentInterface';
import { useForm, type SubmitHandler } from 'react-hook-form';
import styles from './AddStudent.module.scss';
import useGroups from '@/hooks/useGroups';

export type FormFields = Pick<StudentInterface, 'firstName' | 'lastName' | 'middleName' | 'groupId'> & {
  password: string;
};

interface Props {
  onAdd: (studentForm: FormFields) => void;
}

const AddStudent = ({ onAdd }: Props): React.ReactElement => {
  const { groups } = useGroups();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = studentForm => onAdd(studentForm);

  return (
    <div className={styles.AddStudent}>
      <h2>Добавления студента</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <input
          placeholder="Фамилия"
          {...register('lastName', { required: true })}
        />
        {errors.lastName && <div className={styles.errorMessage}>Обязательное поле</div>}

        <input
          placeholder="Имя"
          {...register('firstName', { required: true })}
        />
        {errors.firstName && <div className={styles.errorMessage}>Обязательное поле</div>}

        <input
          placeholder="Отчество"
          {...register('middleName', { required: true })}
        />
        {errors.middleName && <div className={styles.errorMessage}>Обязательное поле</div>}

        <select
          {...register('groupId', { required: true, valueAsNumber: true })}
        >
          <option value="">Выберите группу</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        {errors.groupId && <div className={styles.errorMessage}>Обязательное поле</div>}

        <input
          type="password"
          placeholder="Пароль"
          {...register('password', { required: true, minLength: 3 })}
        />
        {errors.password && <div className={styles.errorMessage}>Пароль обязателен (минимум 3 символа)</div>}

        <input type="submit" value="Добавить" />
      </form>

    </div>
  );
};

export default AddStudent;
