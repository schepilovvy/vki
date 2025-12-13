import type TeacherInterface from '@/types/TeacherInterface';
import { useForm, type SubmitHandler } from 'react-hook-form';
import styles from './AddTeacher.module.scss';

export type FormFields = Pick<TeacherInterface, 'firstName' | 'lastName' | 'middleName' | 'contacts'> & {
  password: string;
};

interface Props {
  onAdd: (_formFields: FormFields) => void;
}

const AddTeacher = ({ onAdd }: Props): React.ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = formFields => onAdd(formFields);

  return (
    <div className={styles.AddTeacher}>
      <h2>Добавление преподавателя</h2>

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

        <input
          placeholder="Контакты"
          {...register('contacts', { required: false })}
        />

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

export default AddTeacher;
