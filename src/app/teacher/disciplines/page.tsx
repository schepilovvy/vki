import TeacherMode from '@/components/TeacherMode/TeacherMode';
import Page from '@/components/layout/Page/Page';
import ProtectedRoute from '@/components/Auth/ProtectedRoute/ProtectedRoute';
import { UserRole } from '@/db/entity/User.entity';
import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import { type Metadata } from 'next/types';

export const metadata: Metadata = {
  title: `Мои дисциплины - ${META_TITLE}`,
  description: META_DESCRIPTION,
};

const TeacherDisciplinesPage = (): React.ReactNode => (
  <Page>
    <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
      <TeacherMode activeTab="disciplines" />
    </ProtectedRoute>
  </Page>
);

export default TeacherDisciplinesPage;
