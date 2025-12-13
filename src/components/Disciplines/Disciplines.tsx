'use client';

import useDisciplines from '@/hooks/useDisciplines';
import type DisciplineInterface from '@/types/DisciplineInterface';
import styles from './Disciplines.module.scss';
import Discipline from './Discipline/Discipline';
import AddDiscipline, { type FormFields } from './AddDiscipline/AddDiscipline';

const Disciplines = (): React.ReactElement => {
  const {
    disciplines,
    deleteDisciplineMutate,
    addDisciplineMutate,
  } = useDisciplines();

  /**
   * Удаление дисциплины - обработчик события нажатия "удалить"
   * @param disciplineId Ид дисциплины
   */
  const onDeleteHandler = (disciplineId: number): void => {
    if (confirm('Удалить дисциплину?')) {
      debugger;
      console.log('onDeleteHandler', disciplineId);

      deleteDisciplineMutate(disciplineId);
    }
  };

  /**
   * Добавление дисциплины - обработчик события нажатия "добавить"
   * @param disciplineFormField Форма дисциплины
   */
  const onAddHandler = (disciplineFormField: FormFields): void => {
    debugger;
    console.log('Добавление дисциплины', disciplineFormField);

    addDisciplineMutate({
      id: -1,
      ...disciplineFormField,
    });
  };

  return (
    <div className={styles.Disciplines}>
      <AddDiscipline onAdd={onAddHandler} />

      <div className={styles.disciplinesList}>
        {disciplines.filter((discipline: DisciplineInterface) => !discipline.isDeleted).map((discipline: DisciplineInterface) => (
          <Discipline
            key={discipline.id}
            discipline={discipline}
            onDelete={onDeleteHandler}
          />
        ))}
      </div>
    </div>
  );
};

export default Disciplines;
