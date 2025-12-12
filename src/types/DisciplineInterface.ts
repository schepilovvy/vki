interface DisciplineInterface {
  id: number;
  name: string;
  groupId: number;
  teacherId: number;
  isDeleted?: boolean;
  isNew?: boolean;
};

export default DisciplineInterface;


