import Teachers from '@/components/Teachers/Teachers';
import Page from '@/components/layout/Page/Page';
import ProtectedRoute from '@/components/Auth/ProtectedRoute/ProtectedRoute';
import { UserRole } from '@/db/entity/User.entity';
import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import { type Metadata } from 'next/types';

export const metadata: Metadata = {
  title: `Преподаватели - ${META_TITLE}`,
  description: META_DESCRIPTION,
};

const TeachersPage = (): React.ReactNode => (
  <Page>
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <h1>Преподаватели</h1>
      <Teachers />
    </ProtectedRoute>
  </Page>
);

export default TeachersPage;

