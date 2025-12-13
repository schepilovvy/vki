interface TeacherInterface {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  isDeleted?: boolean;
  isNew?: boolean;
};

export default TeacherInterface;
