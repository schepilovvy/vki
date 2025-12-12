interface GroupInterface {
  id: number;
  name: string;
  teacherId?: number;
  course?: number;
  specialty?: string;
  isDeleted?: boolean;
  isNew?: boolean;
};

export default GroupInterface;
