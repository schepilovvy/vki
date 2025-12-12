interface GradeInterface {
  id: number;
  studentId: number;
  disciplineId: number;
  grade: number;
  date?: string;
  isDeleted?: boolean;
  isNew?: boolean;
};

export default GradeInterface;


