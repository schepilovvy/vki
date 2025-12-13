interface HomeworkInterface {
  id: number;
  disciplineId: number;
  description: string;
  dueDate?: string;
  title?: string;
  isDeleted?: boolean;
  isNew?: boolean;
};

export default HomeworkInterface;
