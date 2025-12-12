import Students from '@/components/Students/Students';
import Page from '@/components/layout/Page/Page';
import ProtectedRoute from '@/components/Auth/ProtectedRoute/ProtectedRoute';
import { UserRole } from '@/db/entity/User.entity';
import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import { type Metadata } from 'next/types';

export const metadata: Metadata = {
  title: `Студенты - ${META_TITLE}`,
  description: META_DESCRIPTION,
};

const StudentsPage = (): React.ReactNode => (
  <Page>
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <h1>Студенты</h1>
      <Students />
    </ProtectedRoute>
  </Page>
);

export default StudentsPage;
