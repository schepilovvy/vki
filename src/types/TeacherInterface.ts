interface TeacherInterface {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  contacts?: string;
  isDeleted?: boolean;
  isNew?: boolean;
};

export default TeacherInterface;


