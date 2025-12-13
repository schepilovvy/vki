import type { UserRole } from '@/db/entity/User.entity';

interface UserInterface {
  id: number;
  login: string;
  role: UserRole;
  studentId?: number;
  teacherId?: number;
}

export default UserInterface;
