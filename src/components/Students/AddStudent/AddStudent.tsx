import type StudentInterface from '@/types/StudentInterface';
import { useForm, type SubmitHandler } from 'react-hook-form';
import styles from './AddStudent.module.scss';

export type FormFields = Pick<StudentInterface, 'firstName' | 'lastName' | 'middleName'>;

interface Props {
  onAdd: (studentForm: FormFields) => void;
}

const AddStudent = ({ onAdd }: Props): React.ReactElement => {
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
        {errors.lastName && <div>Обязательное поле</div>}

        <input
          placeholder="Имя"
          {...register('firstName', { required: true })}
        />
        {errors.firstName && <div>Обязательное поле</div>}

        <input
          placeholder="Отчество"
          {...register('middleName', { required: true })}
        />
        {errors.middleName && <div>Обязательное поле</div>}

        <input type="submit" value="Добавить" />
      </form>

    </div>
  );
};

export default AddStudent;
