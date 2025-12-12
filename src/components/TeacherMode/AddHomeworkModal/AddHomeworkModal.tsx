'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import type HomeworkInterface from '@/types/HomeworkInterface';
import styles from './AddHomeworkModal.module.scss';

export type FormFields = Pick<HomeworkInterface, 'title' | 'description' | 'dueDate'>;

interface Props {
  disciplineId: number;
  disciplineName: string;
  onAdd: (homework: FormFields & { disciplineId: number }) => void;
  onClose: () => void;
}

const AddHomeworkModal = ({ disciplineId, disciplineName, onAdd, onClose }: Props): React.ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = homeworkForm => {
    onAdd({
      ...homeworkForm,
      disciplineId,
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Назначить домашнее задание</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.disciplineName}>Дисциплина: <strong>{disciplineName}</strong></p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              placeholder="Название задания (необязательно)"
              {...register('title', { required: false })}
            />

            <textarea
              placeholder="Описание задания *"
              rows={5}
              {...register('description', { required: true })}
            />
            {errors.description && <div className={styles.error}>Обязательное поле</div>}

            <input
              type="datetime-local"
              placeholder="Срок выполнения (необязательно)"
              {...register('dueDate', { required: false })}
            />

            <div className={styles.formActions}>
              <button type="button" onClick={onClose} className={styles.cancelButton}>
                Отмена
              </button>
              <button type="submit" className={styles.submitButton}>
                Назначить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHomeworkModal;


